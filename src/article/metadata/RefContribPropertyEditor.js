import { Component } from 'substance'
import InPlaceEditor from './InPlaceEditor'

export default class RefContribPropertyEditor extends Component {
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
    let model = this.props.model
    let name = property.name
    
    // Array of RefContrib models
    let values = model.resolveRelationship(name).map(m => m.toJSON())
    

    return $$(InPlaceEditor, {
      id: model.id,
      name: name,
      warning: this.props.warning,
      values: values
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
RefContribPropertyEditor.matches = function(property) {
  return property.isArray() && property.targetTypes.length === 1 && property.targetTypes[0] === 'ref-contrib'
}