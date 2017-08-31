import { Component } from 'substance'

export default class TextInput extends Component {

  render($$) {
    let node = this.props.node
    let TextPropertyEditor = this.getComponent('text-property-editor')

    return $$('div').addClass('sc-text-input').append(
      $$('div').addClass('se-label').append(this.props.label),
      $$(TextPropertyEditor, {
        placeholder: this.props.label,
        path: node.getTextPath(),
        disabled: this.props.disabled
      }).ref(node.id).addClass('se-text-editor')
    )
  }

}
