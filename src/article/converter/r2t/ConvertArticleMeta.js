import { AritcleRecordConverter, KeywordConverter, SubjectConverter } from './EntityConverters'
import { expandAbstract, insertChildAtFirstValidPos } from './r2tHelpers'

/*
  Expands elements in article-meta which are optional in TextureArticle but
  required in InternalArticle.
*/
export default class ConvertArticleMeta {

  import(dom, api) {
    expandAbstract(dom)

    const pubMetaDb = api.pubMetaDb

    const articleMeta = dom.find('article-meta')
    AritcleRecordConverter.import(articleMeta, pubMetaDb)

    const keywords = dom.findAll('article-meta > kwd-group > kwd')
    // Convert <kwd> elements to keywords entities
    keywords.forEach(kwd => {
      KeywordConverter.import(kwd, pubMetaDb)
      kwd.getParent().removeChild(kwd)
    })

    dom.findAll('article-meta > kwd-group').forEach(kwdGroup => {
      kwdGroup.getParent().removeChild(kwdGroup)
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
    const articleMeta = dom.find('article-meta')
    const pubMetaDb = api.pubMetaDb
    
    const articleRecordNodeId = pubMetaDb.findByType('article-record')[0]
    const articleRecordNode = pubMetaDb.get(articleRecordNodeId)
    const articleRecordEls = AritcleRecordConverter.export($$, articleRecordNode)
    articleRecordEls.forEach(item => {
      if(item) insertChildAtFirstValidPos(articleMeta, item)
    })

    const keywordIdx = pubMetaDb.findByType('keyword')
    const keywords = keywordIdx.map(kwdId => pubMetaDb.get(kwdId))
    const keywordLangs = [...new Set(keywords.map(item => item.language))]
    keywordLangs.forEach(lang => {
      const kwdGroup = $$('kwd-group').setAttribute('xml-lang', lang)
      // NOTE: this function is only working if the xml is valid currently, don't use it during invalid state
      insertChildAtFirstValidPos(articleMeta, kwdGroup)
    })
    keywords.forEach(kwd => {
      const kwdGroup = dom.find(`article-meta > kwd-group[xml-lang="${kwd.language}"]`)
      const newKwdEl = KeywordConverter.export($$, kwd, pubMetaDb)
      kwdGroup.append(newKwdEl)
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
