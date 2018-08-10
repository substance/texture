import { ElementCitationConverter } from './EntityConverters'
import { JATS_BIBR_TYPES, INTERNAL_BIBR_TYPES } from '../../ArticleConstants'

/*
  In the Internal Article format we use a custom model,
  which is similar to what JATS `<ref-list>` and `<element-citation>`s are used for.

  In the internal model there is a dedicated place for references: `article > back > references`
  It consists of an (unordered) list of bibliographic entries (sub-types of type 'bibr').
*/
export default class ConvertReflist {
  import (dom, api) {
    let refList = dom.find('ref-list')
    let refs = refList.findAll('ref')

    let references = dom.createElement('references', { id: 'references' })
    const pubMetaDb = api.pubMetaDb
    refs.forEach(refEl => {
      let elementCitation = refEl.find('element-citation')
      if (!elementCitation) {
        api.error({
          msg: 'Could not find <element-citation> inside <ref>',
          el: refEl
        })
      } else {
        let pubType = elementCitation.attr('publication-type')
        let validTypes = JATS_BIBR_TYPES
        if (validTypes.includes(pubType)) {
          // TODO: let EntityConverters return nodes, not ids
          ElementCitationConverter.import(elementCitation, pubMetaDb, refEl.id)
        } else {
          console.error(`Publication type ${pubType} not found`)
          api.error({
            msg: `Publication type ${pubType} not found`,
            el: elementCitation
          })
        }
      }
    })

    refList.empty()
  }

  export (dom, api) {
    let $$ = dom.createElement.bind(dom)
    let refList = dom.find('back > ref-list')
    const doc = api.doc
    const session = api.session
    const referenceManager = session.getReferenceManager()
    let references = referenceManager._getReferences()

    // Empty ref-list
    refList.empty()

    // Re-export refs according to computed order
    references.forEach(ref => {
      let validTypes = INTERNAL_BIBR_TYPES
      let elementCitation
      if (validTypes.includes(ref.type)) {
        elementCitation = ElementCitationConverter.export($$, ref, doc)
      } else {
        throw new Error('publication type not found.')
      }

      refList.append(
        dom.createElement('ref').attr('id', ref.id).append(
          elementCitation
        )
      )
    })
  }
}
