import { $$, domHelpers } from 'substance'
import { ValueComponent } from '../../kit'

export default class DropdownEditor extends ValueComponent {
  render () {
    const value = this._getValue()
    let el = $$('div').addClass(this._getClassNames())

    const dropdownSelector = $$('select').ref('input').addClass('se-select')
      .val(value)
      .on('click', domHelpers.stop)
      .on('change', this._setValue)

    dropdownSelector.append(
      $$('option').append(this._getLabel())
    )

    this._getValues().forEach(l => {
      const option = $$('option').attr({ value: l.id }).append(l.name)
      if (l.id === value) option.attr({ selected: 'selected' })
      dropdownSelector.append(option)
    })

    el.append(dropdownSelector)

    return el
  }

  _getClassNames () {
    return 'sc-dropdown-editor'
  }

  _getLabel () {
    return this.getLabel('select-value')
  }

  _getValues () {
    return []
  }

  _setValue () {
    const input = this.refs.input
    const value = input.getValue()
    this.context.api.setValue(this._getPath(), value)
  }
}
