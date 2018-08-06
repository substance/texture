import { Component } from 'substance'
import CheckboxInput from './CheckboxInput'

export default class BooleanPropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]

    return $$(CheckboxInput, {
      name: name,
      value: value,
      warning: this.props.warning
    }).ref(name)
  }
}

BooleanPropertyEditor.matches = function(property) {
  return property.type === 'boolean'
}
