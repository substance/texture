import FigureModel from './FigureModel'

export default class TableFigureModel extends FigureModel {
  get type () { return 'table-figure' }

  getFootnotes () {
    const fnIds = this._node.footnotes
    return fnIds.map(fnId => this._api.getModelById(fnId))
  }
}
