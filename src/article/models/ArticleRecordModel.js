import NodeModel from '../../kit/model/NodeModel'

export default class ArticleRecordModel extends NodeModel {
  get type () { return 'article-record' }

  get id () { return this._node.id }

  getPermission () {
    return this._api.getModelById(this._node.permission)
  }
}
