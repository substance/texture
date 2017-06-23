import { NodeComponent, TextPropertyEditor } from 'substance'

export default class TableDataHeadComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let el = $$('th').append(
      $$(TextPropertyEditor, {
        history: '',
        path: node.getTextPath(),
        disabled: this.props.disabled
      })
    )

    return el
  }
}
