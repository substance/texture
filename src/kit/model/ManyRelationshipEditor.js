import ValueComponent from './ValueComponent'
import MultiSelectInput from '../ui/MultiSelectInput'

export default class ManyRelationshipEditor extends ValueComponent {
  render ($$) {
    // TODO: we need a label for the dropdown here
    const label = this.props.label
    let options = this.props.model.getAvailableTargets()
    let selected = this._getSelectedOptions(options)
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

  _getSelectedOptions (options) {
    // pick all selected items from options this makes life easier for the MutliSelectComponent
    // because it does not need to map via ids, just can check equality
    let targetIds = this.props.model.getValue()
    let selected = targetIds.map(id => options.find(item => item.id === id)).filter(Boolean)
    return selected
  }

  _toggleTarget (target) {
    this.props.model.toggleTarget(target)
  }
}
