import { Component, FontAwesomeIcon } from 'substance'

export default class FormRowComponent extends Component {
  render($$) {
    const label = this.props.label
    const warnings = this.props.warnings || []
    const children = this.props.children

    const el = $$('div').addClass('sc-form-row')
    const labelEl = $$('div').addClass('se-label').append(label)
    
    if(warnings.length > 0) {
      labelEl.append(
        $$(FontAwesomeIcon, { icon: 'fa-warning' }).addClass('se-icon')
      )
      el.addClass('sm-warning')
    }

    el.append(
      labelEl,
      $$('div').addClass('se-editor').append(children)
    )
    
    return el
  }
}