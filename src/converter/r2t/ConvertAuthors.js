import { OrganisationConverter, PersonConverter } from './EntityConverters'

export default class ConvertAuthors {
  import(dom, api) {
    const pubMetaDb = api.pubMetaDb
    const affs = dom.findAll('article-meta > aff')
    // Convert <aff> elements to organisation entities
    affs.forEach(aff => {
      let entityId = OrganisationConverter.import(aff, pubMetaDb)
      aff.setAttribute('rid', entityId)
      aff.empty()
    })
    // Convert contrib elements to person entities
    _importPersons(dom, pubMetaDb, 'author')
    _importPersons(dom, pubMetaDb, 'editor')
  }

  export(dom, api) {
    const $$ = dom.createElement
    const pubMetaDb = api.pubMetaDb
    const affs = dom.findAll('article-meta > aff')
    affs.forEach(aff => {
      let entity = pubMetaDb.get(aff.attr('rid'))
      let newAffEl = OrganisationConverter.export($$, entity, pubMetaDb)
      // We want to keep the original document-specific id, and just assign
      // the element's content.
      aff.innerHTML = newAffEl.innerHTML
      aff.removeAttr('rid')
    })
    _exportPersons(dom, pubMetaDb, 'author')
    _exportPersons(dom, pubMetaDb, 'editor')
  }
}

function _importPersons(dom, pubMetaDb, type) {
  let contribGroup = dom.find(`contrib-group[content-type=${type}]`)
  let contribs = contribGroup.findAll('contrib')
  contribs.forEach(contrib => {
    // TODO: detect group authors and use special GroupAuthorConverter
    let entityId = PersonConverter.import(contrib, pubMetaDb)
    contrib.setAttribute('rid', entityId)
    contrib.empty()
  })
}

function _exportPersons($$, dom, pubMetaDb, type) {
  let contribGroup = dom.find(`contrib-group[content-type=${type}]`)
  let contribs = contribGroup.findAll('contrib')
  contribs.forEach(contrib => {
    // TODO: detect group authors and use special GroupAuthorConverter
    let newContribEl = PersonConverter.export($$, contrib, pubMetaDb)
    contrib.innerHTML = newContribEl.innerHTML
    contrib.removeAttr('rid')
  })
}
