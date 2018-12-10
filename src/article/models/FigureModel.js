import { NodeModel } from '../../kit'

export default class FigureModel extends NodeModel {
  getPanels () {
    return this._node.panels.map(id => this._api.getModelById(id))
  }
}
