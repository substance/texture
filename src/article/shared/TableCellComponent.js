import { NodeComponent } from '../../kit'
import TableCellEditor from './TableCellEditor'

export default class TableCellComponent extends NodeComponent {
  render ($$) {
    const cell = this.props.node
    let el = $$(cell.heading ? 'th' : 'td')
    el.addClass('sc-table-cell')
    el.attr({
      id: cell.id,
      'data-row-idx': cell.rowIdx,
      'data-col-idx': cell.colIdx,
      rowspan: cell.rowspan,
      colspan: cell.colspan
    })
    el.append(
      $$(TableCellEditor, {
        path: cell.getPath(),
        disabled: this.props.disabled,
        multiLine: true
      }).ref(cell.id)
    )
    return el
  }
}
