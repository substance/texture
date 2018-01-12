import { JournalArticleConverter, BookConverter, PreprintConverter, ClinicaltrialConverter, ReportConverter } from './EntityConverters'

/*
  We convert <ref> elements into entities and back
*/
export default class ConvertRef {
  import(dom, api) {
    let refs = dom.findAll('ref')
    const pubMetaDb = api.pubMetaDb

    refs.forEach(refEl => {
      let elementCitation = refEl.find('element-citation')
      if (!elementCitation) {
        api.error('Could not find <element-citation> inside <ref>')
      } else {
        let entityId
        switch(elementCitation.attr('publication-type')) {
          case 'journal':
            entityId = JournalArticleConverter.import(elementCitation, pubMetaDb)
            break;
          case 'book':
            entityId = BookConverter.import(elementCitation, pubMetaDb)
            break;
          case 'preprint':
            entityId = PreprintConverter.import(elementCitation, pubMetaDb)
            break;
          case 'clinicaltrial':
            entityId = ClinicaltrialConverter.import(elementCitation, pubMetaDb)
            break;
          case 'report':
            entityId = ReportConverter.import(elementCitation, pubMetaDb)
            break;
          default:
            throw new Error('publication type not found.')
        }
        refEl.attr('rid', entityId)
        refEl.empty()
      }
    })
  }

  export(dom, api) {
    let $$ = dom.createElement.bind(dom)
    let refs = dom.findAll('ref')
    const pubMetaDb = api.pubMetaDb

    refs.forEach(refEl => {
      let entity = pubMetaDb.get(refEl.attr('rid'))
      let elementCitation
      switch(entity.type) {
        case 'journal-article':
          elementCitation = JournalArticleConverter.export($$, entity, pubMetaDb)
          break;
        case 'book':
          elementCitation = BookConverter.export($$, entity, pubMetaDb)
          break;
        case 'preprint':
          elementCitation = PreprintConverter.export($$, entity, pubMetaDb)
          break;
        case 'clinicaltrial':
          elementCitation = ClinicaltrialConverter.export($$, entity, pubMetaDb)
          break;
        case 'report':
          elementCitation = ReportConverter.export($$, entity, pubMetaDb)
          break;
        default:
          throw new Error('publication type not found.')
      }
      refEl.append(
        elementCitation
      )
      refEl.removeAttr('rid')
    })

  }
}
