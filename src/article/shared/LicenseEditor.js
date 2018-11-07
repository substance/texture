import {
  ValueComponent
} from '../../kit'
import { LICENSES } from '../ArticleConstants'

export default class LicenseEditor extends ValueComponent {
  render ($$) {
    const model = this.props.model
    const value = model.getValue()
    let el = $$('div').addClass('sc-license-editor')

    const licenseSelector = $$('select').addClass('se-select')
      .ref('input')
      .on('click', this._supressClickPropagation)
      .on('change', this._setLicense)

    licenseSelector.append(
      $$('option').append(this.getLabel('select-license'))
    )

    LICENSES.forEach(l => {
      const option = $$('option').attr({value: l.id}).append(l.name)
      if (l.id === value) option.attr({selected: 'selected'})
      licenseSelector.append(option)
    })

    el.append(licenseSelector)

    return el
  }

  _setLicense () {
    const model = this.props.model
    const input = this.refs.input
    const value = input.getValue()
    model.setValue(value)
  }

  _supressClickPropagation (e) {
    e.stopPropagation()
  }
}
