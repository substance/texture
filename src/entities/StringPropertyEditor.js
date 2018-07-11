import { Component } from 'substance'
import TextInput from './TextInput'

export default class StringPropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let data = this.props.model.toJSON()
    let value = data[name]
    return $$(TextInput, {
      name: property.name,
      label: this.getLabel(property.name),
      type: 'text',
      value: value,
      placeholder: 'Enter text',
      size: 'large'
    }).ref(name)
  }
}

StringPropertyEditor.matches = function(property) {
  return property.type === 'string'
}
