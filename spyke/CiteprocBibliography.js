import LIBRARY from './library.js'
import LOCALE from './locale-en.xml.js'
import CHICAGO from './chicago.csl.js'
import AMA from './ama.csl.js'

const EXAMPLE_CITATIONS = [
  { citationID: 'c1', citationItems: [{ id: 'Item-1' }], properties: { noteIndex: 0 } },
  { citationID: 'c2', citationItems: [{ id: 'Item-4' }, { id: 'Item-2' }], properties: { noteIndex: 0 } },
  { citationID: 'c3', citationItems: [{ id: 'Item-3' }], properties: { noteIndex: 0 } },
  { citationID: 'c4', citationItems: [{ id: 'Item-2' }], properties: { noteIndex: 0 } }
]

export default class CiteprocBibliography {
  constructor () {
    // CSL json records
    // TODO: in Texture we would need to map to CSL json on the fly
    this._records = new Map()

    // for every record keep a 'rendered' entry
    this._references = new Map()
    // TODO: in Texture we need to be able to insert and remove citations
    // and to update the associated references
    this._citations = new Map()

    // for now using the records from a sample library
    Object.keys(LIBRARY).forEach(id => {
      this._records.set(id, LIBRARY[id])
    })

    // TODO: in Texture these would come via configuration
    this._locales = new Map()
    // for now providing only english
    this._locales.set('en', LOCALE)
    this._locales.set('en-US', LOCALE)

    // this would come from application or DAR setting
    this._style = 'chicago'

    this._engine = new CSL.Engine(this, CHICAGO)

    // TODO: later this should be filled driven by content
    this._registerReferences()
    this._addSampleCitations()
    this._createBibliography()
  }

  retrieveLocale (lang) {
    return this._locales.get(lang)
  }

  retrieveItem (id) {
    return this._records.get(id)
  }

  getReferences () {
    return Array.from(this._references.values())
  }

  getCitations () {
    return Array.from(this._citations.values())
  }

  _registerReferences () {
    let ids = Array.from(this._records.keys())
    this._engine.updateItems(ids)
  }

  _createBibliography () {
    let [res, htmlSnippets] = this._engine.makeBibliography()
    let ids = res.entry_ids.map(arr => arr[0])
    let references = new Map()
    for (let i = 0; i < ids.length; i++) {
      let html = htmlSnippets[i]
      let id = ids[i]
      console.assert(html, 'html snippet for entry should exist')
      // TODO: what is missing here is a label
      references.set(id, {
        id,
        html
      })
    }
    this._references = references
  }

  _addSampleCitations () {
    let pre = []
    for (let i = 0; i < EXAMPLE_CITATIONS.length; i++) {
      let citationData = EXAMPLE_CITATIONS[i]
      // TODO:
      let [, affectedCitations] = this._engine.processCitationCluster(citationData, pre, [])
      affectedCitations.forEach(([pos, html, id]) => {
        this._citations.set(id, {
          id,
          html,
          pos
        })
      })
      pre.push([citationData.citationID, 0])
    }
  }
}
