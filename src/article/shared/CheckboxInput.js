import { Component, FontAwesomeIcon } from 'substance'

export default class CheckboxInput extends Component {
  render($$) {
    const isChecked = this.props.value
    const icon = isChecked ? 'fa-check-square-o' : 'fa-square-o'

    const el = $$('div').addClass('sc-checkbox')
      .on('click', this._onClick)
      .append(
        $$(FontAwesomeIcon, { icon: icon }).addClass('se-icon')
      )

    if(this.props.warning) el.addClass('sm-warning')
    
    return el
  }

  _onClick() {
    const name = this.props.name
    const value = !this.props.value
    this.send('set-value', name, value)
  }
}