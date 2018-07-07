import DefaultModel from './DefaultModel'

/*
  A model for holding metadata.
*/
export default class MetaModel extends DefaultModel {
  constructor(node, context) {
    super(node, context)
  }

  addKeyword(keyword) {
    const editorSession = this.context.editorSession
    const keywordId = this._addEntity(keyword, 'keyword')
    editorSession.transaction((tx, args) => {
      const kwdEl = tx.createElement('kwd').attr('rid', keywordId)
      const kwdGroupEl = tx.find('kwd-group')
      kwdGroupEl.append(kwdEl)
      return args
    })
    return keywordId
  }

  getKeyword(keywordId) {
    return this._getEntity(keywordId)
  }

  getKeywords(category) {
    const kwdGroup = this._node.find('kwd-group')
    const keywordIds = kwdGroup.findAll('kwd').map(kwd => kwd.getAttribute('rid'))
    const keywords = keywordIds.map(keywordId => this._getEntity(keywordId))
    if(!category) return keywords
    return keywords.filter(kwd => kwd.category === category)
  }

  getKeywordCategories() {
    const keywords = this.getKeywords()
    const categories = keywords.map(kwd => kwd.category)
    return categories.filter((cat, i, a) => a.indexOf(cat) === i)
  }

  updateKeyword(keywordId, data) {
    return this._updateEntity(keywordId, data)
  }

  deleteKeyword(keywordId) {
    const editorSession = this.context.editorSession
    const node = this._deleteEntity(keywordId)
    editorSession.transaction((tx, args) => {
      const kwdGroup = tx.find('kwd-group')
      const kwdEl = kwdGroup.find(`kwd[rid=${keywordId}]`)
      kwdEl.parentNode.removeChild(kwdEl)
      tx.delete(kwdEl.id)
      return args
    })
    return node
  }

  addSubject(subject) {
    const editorSession = this.context.editorSession
    const subjectId = this._addEntity(subject, 'subject')
    editorSession.transaction((tx, args) => {
      const subjectEl = tx.createElement('subject').attr('rid', subjectId)
      const subjGroupEl = tx.find('subj-group')
      subjGroupEl.append(subjectEl)
      return args
    })
    return subjectId
  }

  getSubject(subjectId) {
    return this._getEntity(subjectId)
  }

  getSubjects(category) {
    const subjGroup = this._node.find('subj-group')
    const subjectIds = subjGroup.findAll('subject').map(subject => subject.getAttribute('rid'))
    const subjects = subjectIds.map(subjectId => this._getEntity(subjectId))
    if(!category) return subjects
    return subjects.filter(subject => subject.category === category)
  }

  getSubjectCategories() {
    const subjects = this.getSubjects()
    const categories = subjects.map(subject => subject.category)
    return categories.filter((cat, i, a) => a.indexOf(cat) === i)
  }

  updateSubject(subjectId, data) {
    return this._updateEntity(subjectId, data)
  }

  deleteSubject(subjectId) {
    const editorSession = this.context.editorSession
    const node = this._deleteEntity(subjectId)
    editorSession.transaction((tx, args) => {
      const subjGroup = tx.find('subj-group')
      const subjectEl = subjGroup.find(`subject[rid=${subjectId}]`)
      subjectEl.parentNode.removeChild(subjectEl)
      tx.delete(subjectEl.id)
      return args
    })
    return node
  }
}
