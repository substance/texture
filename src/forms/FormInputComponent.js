// Requirements:
// different sizes: 'small', 'medium', 'large'
// error messages: 'error message' (if there use red border)
// inputs should not have any margins
import { Component } from 'substance'

export default class FormInputComponent extends Component {
  render($$) {
    const val = this.props.value
    const size = this.props.size || 'medium'
    const type = this.props.type || 'text'
    const label = this.props.label
    const placeholder = this.props.placeholder
    const error = this.props.error

    const el = $$('div').addClass('sc-form-input sm-size-'+size)

    if(label) {
      el.append(
        $$('label').append(label)
      )
    }

    const input = $$('input').attr({
      value: val,
      type: type,
      placeholder: placeholder
    }).addClass('se-input')
      .ref('input')
      .on('change', this._onChange)

    el.append(input)

    if(error) {
      el.addClass('sm-error').append(
        $$('div').addClass('se-error-msg').append(error)
      )
    }

    return el
  }

  _onChange() {
    const id = this.props.id
    if(id) {
      const value = this._getValue()
      this.send('input:change', id, value)
    }
  }

  _getValue() {
    const input = this.refs.input
    return input.value
  }
}
