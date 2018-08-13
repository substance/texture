import { Component } from 'substance'

export default class TextInputComponent extends Component {
  render ($$) {
    const val = this.props.value
    const size = this.props.size || 'medium'
    const type = this.props.type || 'text'
    const placeholder = this.props.placeholder

    const el = $$('div').addClass('sc-text-input sm-size-' + size)

    const input = $$('input').attr({
      value: val,
      type: type,
      placeholder: placeholder
    }).addClass('se-input')
      .ref('input')
      .on('change', this._onChange)

    el.append(input)

    if (this.props.warning) el.addClass('sm-warning')

    return el
  }

  _onChange () {
    const id = this.props.id
    const name = this.props.name
    const value = this._getValue()
    this.send('set-value', name, value, id)
  }

  _getValue () {
    const input = this.refs.input
    return input.val()
  }
}
