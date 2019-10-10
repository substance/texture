import { $$ } from 'substance'
import ValueComponent from './ValueComponent'
import CheckboxInput from './CheckboxInput'

export default class BooleanComponent extends ValueComponent {
  getActionHandlers () {
    return {
      toggleValue: this._toggleValue
    }
  }

  render () {
    const value = this._getValue()
    let el = $$('div').addClass('sc-boolean')
    if (!this.context.editable) {
      el.addClass('sm-readonly')
    }
    el.append(
      $$(CheckboxInput, { value })
    )
    return el
  }

  _toggleValue () {
    if (this.context.editable) {
      this._setValue(!this._getValue())
    }
  }
}
