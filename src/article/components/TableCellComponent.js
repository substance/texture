import { $$ } from 'substance'
import { NodeComponent } from '../../kit'
import TableCellEditor from './TableCellEditor'

export default class TableCellComponent extends NodeComponent {
  render () {
    const cell = this.props.node
    let el = $$(cell.heading ? 'th' : 'td')
    el.addClass('sc-table-cell')
    el.attr({
      'data-id': cell.id,
      'data-row-idx': cell.rowIdx,
      'data-col-idx': cell.colIdx
    })
    if (cell.rowspan > 1) {
      el.attr('rowspan', cell.rowspan)
    }
    if (cell.colspan > 1) {
      el.attr('colspan', cell.colspan)
    }
    el.append(
      $$(TableCellEditor, {
        path: cell.getPath(),
        disabled: this.props.disabled,
        multiLine: true
      }).ref(cell.id)
    )
    return el
  }

  getId () {
    return this.getAttribute('data-id')
  }
}
