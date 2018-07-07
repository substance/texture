import { KeywordConverter } from './EntityConverters'
import { expandAbstract } from './r2tHelpers'

/*
  Expands elements in article-meta which are optional in TextureArticle but
  required in InternalArticle.
*/
export default class ConvertArticleMeta {

  import(dom, api) {
    expandAbstract(dom)

    const pubMetaDb = api.pubMetaDb
    const keywords = dom.findAll('article-meta > kwd-group')
    // Convert <kwd> elements to keywords entities
    keywords.forEach(kwd => {
      let entityId = KeywordConverter.import(kwd, pubMetaDb)
      kwd.setAttribute('rid', entityId)
      kwd.empty()
    })
  }

  export(dom, api) {
    const $$ = dom.createElement.bind(dom)
    const pubMetaDb = api.pubMetaDb
    const keywords = dom.findAll('article-meta > kwd-group')
    keywords.forEach(kwd => {
      let entity = pubMetaDb.get(kwd.attr('rid'))
      let newKwdEl = KeywordConverter.export($$, entity, pubMetaDb)
      // We want to keep the original document-specific id, and just assign
      // the element's content.
      kwd.innerHTML = newKwdEl.innerHTML
      kwd.removeAttr('rid')
    })
  }
}
