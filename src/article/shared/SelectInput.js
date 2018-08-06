import { Component, FontAwesomeIcon } from 'substance'

export default class SelectInput extends Component {
  didMount () {
    this.context.appState.addObserver(['overlayId'], this.rerender, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const selected = this.props.value
    const options = this.props.availableOptions
    const optionsMap = options.reduce((map,opt)=>{map[opt.id]=opt.text;return map;},{})

    const showValues = this.context.appState.overlayId === this.getId()
    const isEmptyValue = selected === undefined
    const el = $$('div').addClass('sc-select-input')
      .on('click', this._toggleDropdown)

    if(isEmptyValue) {
      el.append(this.getLabel('select-default-value'))
    } else {
      el.append(
        optionsMap[selected],
        $$(FontAwesomeIcon, { icon: 'fa-remove' }).addClass('se-icon')
          .on('click', this._removeValue)
      )
    }
    if (isEmptyValue) el.addClass('sm-empty')

    if (showValues && !(!isEmptyValue && options.length === 1)) {
      el.append(
        this.renderValues($$, options)
      )
    }

    if (this.props.warning) el.addClass('sm-warning')

    return el
  }

  renderValues ($$, options) {
    const label = this.props.name
    const value = this.props.value
    const editorEl = $$('div').addClass('se-select-editor').append(
      $$('div').addClass('se-arrow'),
      $$('div').addClass('se-select-label').append('Choose ' + label)
    )
    options.forEach(opt => {
      if(value !== opt.id) {
        editorEl.append(
          $$('div').addClass('se-select-item').append(opt.text).ref(opt.id)
            .on('click', this._setValue.bind(this, opt.id))
        )
      } else {
        editorEl.append(
          $$('div').addClass('se-select-item sm-active').append(opt.text).ref(opt.id)
        )
      }
    })
    return editorEl
  }

  _setValue(value) {
    const name = this.props.name
    this.send('set-value', name, value)
  }

  _removeValue (event) {
    event.stopPropagation()
    const name = this.props.name
    this.send('set-value', name, undefined)
  }

  _toggleDropdown (event) {
    event.stopPropagation()
    this.send('toggleOverlay', this.getId())
  }
}