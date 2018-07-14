import { Component } from 'substance'
import TextInput from './TextInput'

export default class StringPropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]
    let warning = this.props.warnings.map(w => w.message).join(', ')
    return $$(TextInput, {
      name: name,
      label: this.getLabel(name),
      type: 'text',
      value: value,
      placeholder: 'Enter text',
      size: 'large',
      warning: warning
    }).ref(name)
  }
}

StringPropertyEditor.matches = function(property) {
  return property.type === 'string' && property.name !== 'id'
}
