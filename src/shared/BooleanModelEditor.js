import ValueComponent from './ValueComponent'
import CheckboxInput from './CheckboxInput'

export default class BooleanModelEditor extends ValueComponent {
  getActionHandlers () {
    return {
      toggleValue: this._toggleValue
    }
  }

  render ($$) {
    const model = this.props.model
    const value = model.getValue()
    return $$(CheckboxInput, { value }).ref('checkbox')
  }

  _toggleValue () {
    const model = this.props.model
    this.props.model.setValue(!model.getValue())
  }
}
