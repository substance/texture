import { Component } from 'substance'
import CheckboxInput from './CheckboxInput'

export default class BooleanPropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]
    let warning = this.props.warnings.map(w => w.message).join(', ')
    return $$(CheckboxInput, {
      name: name,
      label: this.getLabel(name),
      value: value,
      warning: warning
    }).ref(name)
  }
}

BooleanPropertyEditor.matches = function(property) {
  return property.type === 'boolean'
}
