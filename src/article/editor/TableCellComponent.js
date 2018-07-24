import NodeComponent from '../shared/NodeComponent'
import TableCellEditor from './TableCellEditor'

export default class TableCellComponent extends NodeComponent {

  render($$) {
    const cell = this.props.node
    let el = $$(cell.attr('heading') ? 'th' : 'td')
    el.addClass('sc-table-cell')
    let attributes = {
      id: cell.id,
      "data-row-idx": cell.rowIdx,
      "data-col-idx": cell.colIdx,
      rowspan: cell.rowspan,
      colspan: cell.colspan,
    }
    el.attr(attributes)
    el.append(
      $$(TableCellEditor, {
        path: cell.getPath(),
        disabled: this.props.disabled
      }).ref(cell.id)
    )
    return el
  }

}
