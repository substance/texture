import ArticleAPI from '../api/ArticleAPI'

export default class MetadataAPI extends ArticleAPI {
  selectCard (nodeId) {
    this._setSelection(this._createCardSelection(nodeId))
  }

  _createCardSelection (nodeId) {
    return {
      type: 'custom',
      customType: 'card',
      nodeId
    }
  }
}
