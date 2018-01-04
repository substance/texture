import { JournalArticleConverter, BookConverter } from './EntityConverters'

/*
  We convert <ref> elements into entities and back
*/
export default class ConvertRef {
  import(dom, api) {
    let refs = dom.findAll('ref')
    const entityDb = api.entityDb

    refs.forEach(refEl => {
      let elementCitation = refEl.find('element-citation')
      if (!elementCitation) {
        api.error('Could not find <element-citation> inside <ref>')
      } else {
        let entityId
        switch(elementCitation.attr('publication-type')) {
          case 'journal':
            entityId = JournalArticleConverter.import(elementCitation, entityDb)
            break;
          case 'book':
            entityId = BookConverter.import(elementCitation, entityDb)
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
    let $$ = dom.createElement
    let refs = dom.findAll('ref')
    const entityDb = api.entityDb

    refs.forEach(refEl => {
      let entity = entityDb.get(refEl.attr('rid'))
      let elementCitation
      switch(entity.type) {
        case 'journal-article':
          elementCitation = JournalArticleConverter.export($$, entity, entityDb)
          break;
        case 'book':
          elementCitation = BookConverter.export($$, entity, entityDb)
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
