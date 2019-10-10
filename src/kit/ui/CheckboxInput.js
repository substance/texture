import { Component, $$, FontAwesomeIcon } from 'substance'

export default class CheckboxInput extends Component {
  render () {
    const isChecked = Boolean(this.props.value)
    const icon = isChecked ? 'fa-check-square-o' : 'fa-square-o'
    let el = $$('div').addClass('sc-checkbox')
      .on('click', this._onClick)
    el.append(
      // TODO: use icon provider
      $$(FontAwesomeIcon, { icon: icon }).addClass('se-icon')
    )
    return el
  }

  _onClick (e) {
    e.preventDefault()
    e.stopPropagation()
    this.send('toggleValue')
  }
}
