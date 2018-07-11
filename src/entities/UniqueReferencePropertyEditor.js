import { Component } from 'substance'
import SelectInput from './SelectInput'
import { getAvailableOptions } from './propertyEditorHelpers'

export default class UniqueReferencePropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]

    let targetType = property.type
    return $$(SelectInput, {
      id: name,
      value: value,
      availableOptions: getAvailableOptions(this.context.api, [targetType]),
      label: this.getLabel(name)
    }).ref(name)
  }
}

UniqueReferencePropertyEditor.matches = function(property) {
  // HACK: need to be fixed in substance
  // return property.isReference() && !property.isArray()
  return !property.isArray() && new Array('string', 'boolean').indexOf(property.type) === -1
}

