import { Component } from 'substance'
import TextInput from './TextInput'

export default class StringPropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]
    return $$(TextInput, {
      name: name,
      type: 'text',
      value: value,
      warning: this.props.warning,
      placeholder: 'Enter text',
      size: 'large'
    }).ref(name)
  }
}

StringPropertyEditor.matches = function(property) {
  return property.type === 'string' && property.name !== 'id'
}
