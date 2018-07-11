import { Component } from 'substance'
import MultiSelectInput from './MultiSelectInput'
import { getAvailableOptions } from './propertyEditorHelpers'

export default class ReferencePropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]
    return $$(MultiSelectInput, {
      name: name,
      selectedOptions: value,
      availableOptions: getAvailableOptions(this.context.api, property.targetTypes),
      label: this.getLabel(name)
    }).ref(name)
  }
}

/* Used for all multi-valued references */
ReferencePropertyEditor.matches = function(property) {
  return property.isReference() && property.isArray()
}