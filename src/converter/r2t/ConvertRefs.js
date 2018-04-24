import { JournalArticleConverter, BookConverter,
  ClinicalTrialConverter, ConferenceProceedingConverter, DataPublicationConverter,
  PatentConverter, Periodical, PreprintConverter, ReportConverter,
  SoftwareConverter, ThesisConverter, WebpageConverter, ChapterConverter
} from './EntityConverters'

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
        api.error({
          msg: 'Could not find <element-citation> inside <ref>',
          el: refEl
        })
      } else {
        let entityId
        let pubType = elementCitation.attr('publication-type')
        switch(pubType) {
          case 'journal':
            entityId = JournalArticleConverter.import(elementCitation, pubMetaDb)
            break;
          case 'book':
            if (elementCitation.find('chapter-title')) {
              entityId = ChapterConverter.import(elementCitation, pubMetaDb)
            } else {
              entityId = BookConverter.import(elementCitation, pubMetaDb)
            }
            break;
          case 'chapter':
            entityId = ChapterConverter.import(elementCitation, pubMetaDb)
            break;
          case 'clinicaltrial':
            entityId = ClinicalTrialConverter.import(elementCitation, pubMetaDb)
            break;
          case 'confproc':
            entityId = ConferenceProceedingConverter.import(elementCitation, pubMetaDb)
            break;
          case 'data':
            entityId = DataPublicationConverter.import(elementCitation, pubMetaDb)
            break;
          case 'patent':
            entityId = PatentConverter.import(elementCitation, pubMetaDb)
            break;
          case 'periodical':
            entityId = Periodical.import(elementCitation, pubMetaDb)
            break;
          case 'preprint':
            entityId = PreprintConverter.import(elementCitation, pubMetaDb)
            break;
          case 'report':
            entityId = ReportConverter.import(elementCitation, pubMetaDb)
            break;
          case 'software':
            entityId = SoftwareConverter.import(elementCitation, pubMetaDb)
            break;
          case 'thesis':
            entityId = ThesisConverter.import(elementCitation, pubMetaDb)
            break;
          case 'webpage':
            entityId = WebpageConverter.import(elementCitation, pubMetaDb)
            break;
          default:
            console.error(`Publication type ${pubType} not found`)
            api.error({
              msg: `Publication type ${pubType} not found`,
              el: elementCitation
            })
        }
        refEl.attr('rid', entityId)
        refEl.empty()
      }
    })
  }

  export(dom, api) {
    let $$ = dom.createElement.bind(dom)
    let refList = dom.find('back > ref-list')
    const pubMetaDb = api.pubMetaDb
    const doc = api.doc
    const referenceManager = doc.referenceManager
    let bibliography = referenceManager.getBibliography()

    // Empty ref-list
    refList.empty()

    // Re-export refs according to computed order
    bibliography.forEach(refNode => {
      let entity = pubMetaDb.get(refNode.attr('rid'))
      let elementCitation
      switch(entity.type) {
        case 'journal-article':
          elementCitation = JournalArticleConverter.export($$, entity, pubMetaDb)
          break;
        case 'book':
          elementCitation = BookConverter.export($$, entity, pubMetaDb)
          break;
        case 'chapter':
          elementCitation = ChapterConverter.export($$, entity, pubMetaDb)
          break;
        case 'clinical-trial':
          elementCitation = ClinicalTrialConverter.export($$, entity, pubMetaDb)
          break;
        case 'conference-proceeding':
          elementCitation = ConferenceProceedingConverter.export($$, entity, pubMetaDb)
          break;
        case 'data-publication':
          elementCitation = DataPublicationConverter.export($$, entity, pubMetaDb)
          break;
        case 'patent':
          elementCitation = PatentConverter.export($$, entity, pubMetaDb)
          break;
        case 'periodical':
          elementCitation = Periodical.export($$, entity, pubMetaDb)
          break;
        case 'preprint':
          elementCitation = PreprintConverter.export($$, entity, pubMetaDb)
          break;
        case 'report':
          elementCitation = ReportConverter.export($$, entity, pubMetaDb)
          break;
        case 'software':
          elementCitation = SoftwareConverter.export($$, entity, pubMetaDb)
          break;
        case 'thesis':
          elementCitation = ThesisConverter.export($$, entity, pubMetaDb)
          break;
        case 'webpage':
          elementCitation = WebpageConverter.export($$, entity, pubMetaDb)
          break;
        default:
          throw new Error('publication type not found.')
      }

      refList.append(
        dom.createElement('ref').attr('id', refNode.id).append(
          elementCitation
        )
      )
    })

  }
}
