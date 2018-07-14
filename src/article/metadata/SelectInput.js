import { Component } from 'substance'

export default class SelectInput extends Component {
  render($$) {
    const label = this.props.label
    const value = this.props.value
    const options = this.props.availableOptions
    const warning = this.props.warning

    const el = $$('div').addClass('sc-select-input')
    const selectEl = $$('select').addClass('se-select')
      .ref('input')
      .on('change', this._onChange)

  
    const defaultOpt = $$('option').attr({value: false})
      .append(this.getLabel('select-default-value'))
    
    if(!value) {
      defaultOpt.attr({selected: 'selected'})
    }

    selectEl.append(defaultOpt)

    options.forEach(opt => {
      const optEl = $$('option').attr({value: opt.id}).append(opt.text)
      if(opt.id === value) optEl.attr({selected: 'selected'})
      selectEl.append(optEl)
    })

    const inputWrap = $$('div').addClass('se-select-input').append(selectEl)

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

  _onChange() {
    const name = this.props.name
    const value = this._getValue()
    this.send('set-value', name, value)
  }

  _getValue() {
    const input = this.refs.input
    return input.val()
  }
}