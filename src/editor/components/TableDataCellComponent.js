import { NodeComponent, TextPropertyEditor } from 'substance'

export default class TableDataCellComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let el = $$('td').append(
      $$(TextPropertyEditor, {
        history: '',
        path: node.getTextPath(),
        disabled: this.props.disabled
      })
    )

    return el
  }
}
