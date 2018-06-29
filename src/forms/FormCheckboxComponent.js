import { Component } from 'substance'

export default class FormCheckboxComponent extends Component {
  render($$) {
    const val = this.props.value === true ? 'checked' : ''
    const id = this.props.id
    const size = this.props.size || 'medium'
    const label = this.props.label

    const el = $$('div').addClass('sc-form-checkbox sm-size-'+size)

    const input = $$('input').attr({
      value: val,
      type: 'checkbox'
    }).addClass('se-input')
      .ref('input')
      .on('change', this._onChange)

    if(id) {
      input.attr({id: id})
    }

    el.append(input)

    if(label) {
      const labelEl = $$('label').append(label)
      if(id) {
        labelEl.attr({for: id})
      }
      el.append(labelEl)
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
    return input.checked ? true : false
  }
}
