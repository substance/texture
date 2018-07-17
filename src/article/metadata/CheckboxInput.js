import { Component, FontAwesomeIcon } from 'substance'

export default class CheckboxInput extends Component {
  render($$) {
    const label = this.props.label
    const isChecked = this.props.value
    const warning = this.props.warning

    const el = $$('div').addClass('sc-checkbox')
    const icon = isChecked ? 'fa-check-square-o' : 'fa-square-o'
    const inputEl = $$('div').addClass('se-checkbox')
      .on('click', this._onClick)
      .append(
        $$(FontAwesomeIcon, { icon: icon }).addClass('se-icon')
      )

    const inputWrap = $$('div').addClass('se-checkbox-input').append(inputEl)

    if(warning) {
      el.addClass('sm-warning')
      inputWrap.append(
        $$('div').addClass('se-warning-msg').append(warning)
      )
    }
    
    el.append(
      $$('div').addClass('se-label').append(label),
      inputWrap
    )

    return el
  }

  _onClick() {
    const name = this.props.name
    const value = !this.props.value
    this.send('set-value', name, value)
  }
}