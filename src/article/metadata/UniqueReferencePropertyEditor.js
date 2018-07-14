import { Component } from 'substance'
import SelectInput from './SelectInput'
import { getAvailableOptions } from './propertyEditorHelpers'

export default class UniqueReferencePropertyEditor extends Component {

  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]
    let warning = this.props.warnings.map(w => w.message).join(', ')

    return $$(SelectInput, {
      name: name,
      value: value,
      availableOptions: getAvailableOptions(this.context.api, property.targetTypes),
      label: this.getLabel(name),
      warning: warning
    }).ref(name)
  }
}

UniqueReferencePropertyEditor.matches = function(property) {
  return property.isReference() && !property.isArray()
}

