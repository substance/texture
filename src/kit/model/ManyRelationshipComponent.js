import ValueComponent from './ValueComponent'
import MultiSelectInput from '../ui/MultiSelectInput'

export default class ManyRelationshipComponent extends ValueComponent {
  render ($$) {
    // TODO: we need a label for the dropdown here
    const label = this.props.label
    let options = this.props.model.getAvailableTargets()
    let selected = this._getSelectedOptions(options)
    let el = $$('div').addClass('sc-many-relationship')
    if (this.context.editable) {
      el.append(
        $$(MultiSelectInput, {
          label,
          selected,
          options
        }).ref('select')
      )
    } else {
      const selectedLabels = selected.map(item => item.toString())
      let label = selectedLabels.join('; ')
      el.addClass('sm-readonly').append(label)
    }
    return el
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
    if (this.context.editable) {
      this.props.model.toggleTarget(target)
    }
  }
}
