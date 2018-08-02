import { Component, isNil } from 'substance'

export default class SelectInput extends Component {
  didMount () {
    this.context.appState.addObserver(['overlayId'], this.rerender, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const value = this.props.value
    const options = this.props.options

    const el = $$('div').addClass('sc-select-input')
    const selectEl = $$('select').addClass('se-select')
      .ref('input')
      .on('change', this._onChange)

    const defaultOpt = $$('option').attr({value: false})
      .append(this.getLabel('select-default-value'))

    if (isNil(value)) {
      defaultOpt.attr({selected: 'selected'})
    }

    selectEl.append(defaultOpt)

    options.forEach(opt => {
      const optEl = $$('option').attr({ value: opt.id }).append(opt.text)
      if (opt.id === value) optEl.attr({selected: 'selected'})
      selectEl.append(optEl)
    })

    el.append(selectEl)

    return el
  }

  _onChange () {
    const value = this._getSelectedValue()
    this.emit('valueChange', value)
  }

  _getSelectedValue () {
    const input = this.refs.input
    return input.val()
  }
}
