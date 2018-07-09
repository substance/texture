import { OrganisationConverter, AwardConverter, PersonConverter, GroupConverter } from './EntityConverters'
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

    const awards = dom.findAll('article-meta > funding-group > award-group')
    // Convert <award-group> elements to award entities
    awards.forEach(award => {
      let entityId = AwardConverter.import(award, pubMetaDb)
      award.setAttribute('rid', entityId)
      award.empty()
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

    const awards = dom.findAll('article-meta > funding-group > award-group')
    awards.forEach(award => {
      let entity = pubMetaDb.get(award.attr('rid'))
      let AwardGroupEl = AwardConverter.export($$, entity, pubMetaDb)
      // We want to keep the original document-specific id, and just assign
      // the element's content.
      award.innerHTML = AwardGroupEl.innerHTML
      award.removeAttr('rid')
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
      contrib.parentNode.removeChild(contrib)
    } else {
      entityId = PersonConverter.import(contrib, pubMetaDb)
      contrib.setAttribute('rid', entityId)
      contrib.empty()
    }
  })
}

function _exportPersons($$, dom, pubMetaDb, type) {
  let contribGroup = dom.find(`contrib-group[content-type=${type}]`)
  if(contribGroup === null) return
  let contribs = contribGroup.findAll('contrib')
  let groupMembers = []
  contribs.forEach(contrib => {
    const groupId = contrib.attr('gid')
    if(groupId) {
      groupMembers.push(contrib)
      // contrib.removeAttr('rid')
      // contrib.removeAttr('gid')
      contrib.empty()

      const groupEl = dom.find(`contrib#${groupId}`)
      if(!groupEl) {
        this._exportGroup($$, dom, pubMetaDb, groupId)
      }

      return
    }
    let node = pubMetaDb.get(contrib.attr('rid'))
    let newContribEl
    if (node.type === 'group') {
      newContribEl = GroupConverter.export($$, node, pubMetaDb)
    } else {
      newContribEl = PersonConverter.export($$, node, pubMetaDb)
    }
    
    contrib.innerHTML = newContribEl.innerHTML
    contrib.removeAttr('rid')
  })

  groupMembers.forEach(contrib => {
    let node = pubMetaDb.get(contrib.attr('rid'))
    let contribEl = dom.find(`contrib#${node.id}`)
    let contribGroupEl = contribEl.find('contrib-group')
    if(!contribGroupEl) {
      contribGroupEl = contribEl.append(
        $$('contrib-group').attr({'contrib-type': 'group-member'})
      )
    }
    let newContribEl = PersonConverter.export($$, node, pubMetaDb)
    contribEl.append(newContribEl)
  })
}

_exportGroup($$, dom, pubMetaDb, type) {

}
