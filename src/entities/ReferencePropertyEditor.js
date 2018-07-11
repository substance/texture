import { Component } from 'substance'
import MultiSelectInput from './MultiSelectInput'
import { getAvailableOptions } from './propertyEditorHelpers'

export default class ReferencePropertyEditor extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'add-contrib': this._addContrib,
      'update-contrib': this._updateContrib,
      'remove-contrib': this._removeContrib
    })
  }
  
  render($$) {
    let property = this.props.property
    let name = property.name
    let data = this.props.model.toJSON()
    let value = data[name]
    // TODO: remove a div wrapper after ref persistence will be fixed in substance
    return $$(MultiSelectInput, {
      name: name,
      selectedOptions: value,
      availableOptions: getAvailableOptions(this.context.api, property.targetTypes),
      label: this.getLabel(name)
    }).ref(name)
  }

  _addContrib(propName) {
    const model = this.props.model
    model.addContrib(propName)
  }

  _removeContrib(propName, contribId) {
    const model = this.props.model
    model.removeContrib(propName, contribId)
  }

  _updateContrib(contribId, propName, value) {
    const model = this.props.model
    model.updateContrib(contribId, propName, value)
    // TODO: find a better way of updating the entity header
    this.rerender()
  }
}

/* Used for all multi-valued references */
ReferencePropertyEditor.matches = function(property) {
  return property.isReference() && property.isArray()
}