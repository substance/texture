import FigureModel from './FigureModel'
import TableFootnoteCollectionModel from './TableFootnoteCollectionModel'

export default class TableFigureModel extends FigureModel {
  get type () { return 'table-figure' }

  getFootnotes () {
    return new TableFootnoteCollectionModel(this._api, this._node)
  }
}
