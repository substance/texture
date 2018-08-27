import { createValueModel } from '../../kit'
import { getLabel } from '../shared/nodeHelpers'
import NodeModel from '../../kit/model/NodeModel'

export default class FigureModel extends NodeModel {
  constructor (api, node) {
    super(api, node)
    // this._api = api
    // this._node = node

    this._title = createValueModel(api, 'text', [node.id, 'title'])
  }

  get type () { return 'figure' }

  get id () { return this._node.id }

  getTitle () {
    return this._title
  }

  getContent () {
    return this._api.getModelById(this._node.content)
  }

  getLabel () {
    return getLabel(this._node)
  }

  getCaption () {
    return this._api.getModelById(this._node.caption)
  }
}
