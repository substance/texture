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
}
