import Table from '../nodes/Table'
import Figure from './Figure'
import { CHILD, CHILDREN } from 'substance'

export default class TableFigure extends Figure {
  // HACK: we need a place to store the tableFootnoteManager
  // in a controlled fashion
  getFootnoteManager () {
    return this._tableFootnoteManager
  }

  setFootnoteManager (footnoteManager) {
    this._tableFootnoteManager = footnoteManager
  }

  hasFootnotes () {
    return this.footnotes && this.footnotes.length > 0
  }

  static getTemplate (options = {}) {
    return {
      type: 'table-figure',
      content: Table.getTemplate(options),
      legend: [{ type: 'paragraph' }],
      permission: { type: 'permission' }
    }
  }
}
TableFigure.schema = {
  type: 'table-figure',
  content: CHILD('table'),
  footnotes: CHILDREN('footnote')
}
