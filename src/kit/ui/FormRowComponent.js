import { Component, $$, FontAwesomeIcon } from 'substance'
import Tooltip from './Tooltip'

export default class FormRowComponent extends Component {
  render () {
    const label = this.props.label
    const issues = this.props.issues || []
    const hasIssues = issues.length > 0
    const children = this.props.children

    const el = $$('div').addClass('sc-form-row')

    if (label) {
      const labelEl = $$('div').addClass('se-label').append(label)
      if (hasIssues) {
        // TODO: use issue.key and labelProvider here
        let tooltipText = issues.map(issue => issue.message).join(', ')
        labelEl.append(
          $$('div').addClass('se-warning').append(
            $$(FontAwesomeIcon, { icon: 'fa-warning' }).addClass('se-icon'),
            $$(Tooltip, { text: tooltipText })
          )
        )
      }
      el.append(labelEl)
    }
    if (hasIssues) {
      el.addClass('sm-warning')
    }
    el.append(
      $$('div').addClass('se-editor').append(children)
    )
    return el
  }
}
