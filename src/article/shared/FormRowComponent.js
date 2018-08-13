import { Component, FontAwesomeIcon } from 'substance'
import { Tooltip } from '../../kit'

export default class FormRowComponent extends Component {
  render ($$) {
    const label = this.props.label
    const warnings = this.props.warnings || []
    const hasWarnings = warnings.length > 0
    const children = this.props.children

    const el = $$('div').addClass('sc-form-row')

    if (label) {
      const labelEl = $$('div').addClass('se-label').append(label)

      if (hasWarnings) {
        labelEl.append(
          $$('div').addClass('se-warning').append(
            $$(FontAwesomeIcon, { icon: 'fa-warning' }).addClass('se-icon'),
            $$(Tooltip, {text: warnings.join(', ')})
          )
        )
      }

      el.append(labelEl)
    }

    if (hasWarnings) {
      el.addClass('sm-warning')
    }

    el.append(
      $$('div').addClass('se-editor').append(children)
    )

    return el
  }
}
