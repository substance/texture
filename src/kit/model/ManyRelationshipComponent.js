import ValueComponent from './ValueComponent'
import MultiSelectInput from '../ui/MultiSelectInput'

export default class ManyRelationshipComponent extends ValueComponent {
  render ($$) {
    const label = this.getLabel('select-item') + ' ' + this.props.label
    const options = this.getAvailableOptions()
    let selected = this._getSelectedOptions(options)
    let el = $$('div').addClass('sc-many-relationship')
    if (this.context.editable) {
      el.append(
        $$(MultiSelectInput, {
          label,
          selected
        }).ref('select')
      )
    } else {
      const selectedLabels = []
      // ATTENTION: doing this with a for loop as it can happen
      // that an item is undefined (if id is not avaiable)
      for (let item of selected) {
        if (item) {
          selectedLabels.push(item.toString())
        }
      }
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

  getAvailableOptions () {
    let model = this.props.model
    return model.getAvailableTargets()
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
