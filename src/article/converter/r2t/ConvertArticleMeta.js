import { KeywordConverter, SubjectConverter } from './EntityConverters'
import { expandAbstract } from './r2tHelpers'

/*
  Expands elements in article-meta which are optional in TextureArticle but
  required in InternalArticle.
*/
export default class ConvertArticleMeta {

  import(dom, api) {
    expandAbstract(dom)

    const pubMetaDb = api.pubMetaDb
    const keywords = dom.findAll('article-meta > kwd-group > kwd')
    // Convert <kwd> elements to keywords entities
    keywords.forEach(kwd => {
      let entityId = KeywordConverter.import(kwd, pubMetaDb)
      kwd.setAttribute('rid', entityId)
      kwd.empty()
    })

    const subjects = dom.findAll('article-meta subj-group > subject')
    // Convert <subject> elements to subject entities
    subjects.forEach(subject => {
      let entityId = SubjectConverter.import(subject, pubMetaDb)
      subject.setAttribute('rid', entityId)
      subject.empty()
    })
  }

  export(dom, api) {
    const $$ = dom.createElement.bind(dom)
    const pubMetaDb = api.pubMetaDb
    const keywords = dom.findAll('article-meta > kwd-group > kwd')
    keywords.forEach(kwd => {
      let entity = pubMetaDb.get(kwd.attr('rid'))
      let newKwdEl = KeywordConverter.export($$, entity, pubMetaDb)
      // We want to keep the original document-specific id, and just assign
      // the element's content.
      kwd.innerHTML = newKwdEl.innerHTML
      kwd.removeAttr('rid')
    })

    const subjects = dom.findAll('article-meta subj-group > subject')
    subjects.forEach(subject => {
      let entity = pubMetaDb.get(subject.attr('rid'))
      let newSubjectEl = SubjectConverter.export($$, entity, pubMetaDb)
      // We want to keep the original document-specific id, and just assign
      // the element's content.
      subject.innerHTML = newSubjectEl.innerHTML
      subject.removeAttr('rid')
    })
  }
}
