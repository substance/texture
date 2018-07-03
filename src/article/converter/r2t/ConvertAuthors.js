import { OrganisationConverter, PersonConverter, GroupConverter } from './EntityConverters'
import { expandContribGroup, removeEmptyElementsIfNoChildren } from './r2tHelpers'

export default class ConvertAuthors {
  import(dom, api) {
    const pubMetaDb = api.pubMetaDb

    expandContribGroup(dom, 'author')
    expandContribGroup(dom, 'editor')

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
    _importPersons(dom, pubMetaDb, 'inventor')
    _importPersons(dom, pubMetaDb, 'sponsor')
  }

  export(dom, api) {
    const $$ = dom.createElement.bind(dom)
    const pubMetaDb = api.pubMetaDb

    // NOTE: We must export authors and editors first, as otherwise we'd be
    // loosing the relationship of internal aff ids and global org ids.
    _exportPersons($$, dom, pubMetaDb, 'author')
    _exportPersons($$, dom, pubMetaDb, 'editor')
    _exportPersons($$, dom, pubMetaDb, 'inventor')
    _exportPersons($$, dom, pubMetaDb, 'sponsor')

    const affs = dom.findAll('article-meta > aff')
    affs.forEach(aff => {
      let entity = pubMetaDb.get(aff.attr('rid'))
      let newAffEl = OrganisationConverter.export($$, entity, pubMetaDb)
      // We want to keep the original document-specific id, and just assign
      // the element's content.
      aff.innerHTML = newAffEl.innerHTML
      aff.removeAttr('rid')
    })

    // Remove all empty contrib-groups as they are not valid JATS
    removeEmptyElementsIfNoChildren(dom, 'contrib-group')
  }
}


function _importPersons(dom, pubMetaDb, type) {
  let contribGroup = dom.find(`contrib-group[content-type=${type}]`)
  if(contribGroup === null) return
  let contribs = contribGroup.findAll('contrib')
  contribs.forEach(contrib => {
    let entityId

    if (contrib.attr('contrib-type') === 'group') {
      entityId = GroupConverter.import(contrib, pubMetaDb)
    } else {
      entityId = PersonConverter.import(contrib, pubMetaDb)
    }
    contrib.setAttribute('rid', entityId)
    contrib.empty()
  })
}

function _exportPersons($$, dom, pubMetaDb, type) {
  let contribGroup = dom.find(`contrib-group[content-type=${type}]`)
  if(contribGroup === null) return
  let contribs = contribGroup.findAll('contrib')
  contribs.forEach(contrib => {
    let node = pubMetaDb.get(contrib.attr('rid'))
    // TODO: detect group authors and use special GroupAuthorConverter
    let newContribEl = PersonConverter.export($$, node, pubMetaDb)
    contrib.innerHTML = newContribEl.innerHTML
    // HACK: we can set contrib-type explicitly to person for now,
    // until we introduce support for group authors
    contrib.setAttribute('contrib-type', 'person')
    contrib.removeAttr('rid')
  })
}
