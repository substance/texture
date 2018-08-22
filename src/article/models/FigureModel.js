import { createValueModel } from '../../kit'
import { getLabel } from '../shared/nodeHelpers'

export default class FigureModel {
  constructor (api, node) {
    this._api = api
    this._node = node

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
