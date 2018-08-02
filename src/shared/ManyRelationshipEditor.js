import ValueComponent from './ValueComponent'
import MultiSelectInput from './MultiSelectInput'

export default class ManyRelationshipEditor extends ValueComponent {
  render ($$) {
    // TODO: we need a label for the dropdown here
    const label = this.props.label
    const model = this.props.model
    let targetIds = model.getValue()
    let options = model.getAvailableTargets()
    // pick all selected items from options
    // this makes life easier for the MutliSelectComponent
    let selected = targetIds.map(id => options.find(item => item.id === id)).filter(Boolean)

    return $$(MultiSelectInput, {
      label,
      selected,
      options
    }).ref('select')
  }

  getActionHandlers () {
    return {
      toggleOption: this._toggleTarget
    }
  }

  _toggleTarget (target) {
    this.props.model.toggleTarget(target)
  }
}
