import { Component } from 'substance'

export default class TextInput extends Component {
  render ($$) {
    let node = this.props.node
    let label = this.props.label
    let TextPropertyEditor = this.getComponent('text-property-editor')

    let el = $$('div').addClass('sc-text-input')

    if (label) {
      el.append(
        $$('div').addClass('se-label').append(label)
      )
    }

    el.append(
      $$(TextPropertyEditor, {
        placeholder: label,
        path: node.getPath(),
        disabled: this.props.disabled
      }).ref(node.id).addClass('se-text-editor')
    )

    return el
  }
}
