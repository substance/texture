import { Component } from 'substance'
import MultiSelectInput from './MultiSelectInput'
import { getAvailableOptions } from './propertyEditorHelpers'

export default class ReferencePropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]
    // TODO: remove a div wrapper after ref persistence will be fixed in substance
    return $$('div').append($$(MultiSelectInput, {
      name: name,
      selectedOptions: value,
      availableOptions: getAvailableOptions(this.context.api, property.targetTypes),
      label: this.getLabel(name)
    }).ref(name))
  }
}

/* Used for all multi-valued references */
ReferencePropertyEditor.matches = function(property) {
  return property.isReference() && property.isArray()
}