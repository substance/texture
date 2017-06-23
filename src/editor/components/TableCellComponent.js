import { NodeComponent, TextPropertyEditor } from 'substance'

export default class TableCellComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let el = $$(node.type)
    el.attr({
      colspan: node.attr('colspan'),
      rowspan: node.attr('rowspan')
    })
    el.append(
      $$(TextPropertyEditor, {
        path: node.getTextPath(),
        disabled: this.props.disabled
      }).ref('editor')
    )
    return el
  }

}
