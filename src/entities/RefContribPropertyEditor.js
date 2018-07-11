import { Component } from 'substance'
import InPlaceEditor from './InPlaceEditor'

export default class RefContribPropertyEditor extends Component {
  render($$) {
    let property = this.props.property
    let model = this.props.model
    let name = property.name
    
    // Array of RefContrib models
    let values = model.resolveRelationship(name)

    return $$(InPlaceEditor, {
      id: model.id,
      label: this.getLabel(name),
      name: name,
      values: values
    }).ref(name)
  }
}

/* Used for all multi-valued references */
RefContribPropertyEditor.matches = function(property) {
  return property.isArray() && property.targetTypes.length === 1 && property.targetTypes[0] === 'ref-contrib'
}