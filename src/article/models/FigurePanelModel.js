import { createValueModel } from '../../kit'
import { getLabel } from '../shared/nodeHelpers'
import NodeModel from '../../kit/model/NodeModel'

export default class FigurePanelModel extends NodeModel {
  constructor (api, node) {
    super(api, node)

    this._title = createValueModel(api, 'text', [node.id, 'title'])
  }

  getTitle () {
    return this._title
  }

  getContent () {
    return this._api.getModelById(this._node.content)
  }

  getPermission () {
    return this._api.getModelById(this._node.permission)
  }

  getLabel () {
    return getLabel(this._node)
  }

  getCaption () {
    return this._api.getModelById(this._node.caption)
  }
}
