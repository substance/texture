import ValueComponent from './ValueComponent'
import CheckboxInput from './CheckboxInput'

export default class BooleanComponent extends ValueComponent {
  getActionHandlers () {
    return {
      toggleValue: this._toggleValue
    }
  }

  render ($$) {
    const model = this.props.model
    const value = model.getValue()
    let el = $$('div').addClass('sc-boolean')
    if (!this.context.editable) {
      el.addclass('sm-readonly')
    }
    el.append(
      $$(CheckboxInput, { value }).ref('checkbox')
    )
    return el
  }

  _toggleValue () {
    if (this.context.editable) {
      const model = this.props.model
      this.props.model.setValue(!model.getValue())
    }
  }
}
