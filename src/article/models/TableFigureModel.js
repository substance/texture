import FigurePanelModel from './FigurePanelModel'
import TableFootnoteCollectionModel from './TableFootnoteCollectionModel'

export default class TableFigureModel extends FigurePanelModel {
  get type () { return 'table-figure' }

  getFootnotes () {
    return new TableFootnoteCollectionModel(this._api, this._node)
  }
}
