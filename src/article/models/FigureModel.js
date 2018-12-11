import { NodeModel, CollectionValueModel } from '../../kit'

export default class FigureModel extends NodeModel {
  hasPanels () {
    return this._node.panels.length > 0
  }

  getPanels () {
    return new CollectionValueModel(this._api, [this._node.id, 'panels'], 'figure-panel')
  }
}
