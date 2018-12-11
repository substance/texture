import { NodeModel } from '../../kit'

export default class FigureModel extends NodeModel {
  hasPanels () {
    return this._node.panels.length > 0
  }

  getPanels () {
    return this._node.panels.map(id => this._api.getModelById(id))
  }
}
