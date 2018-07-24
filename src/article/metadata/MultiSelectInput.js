import { Component, FontAwesomeIcon } from 'substance'

export default class MultiSelectInput extends Component {
  constructor (...args) {
    super(...args)
    console.log('Creating new MultiSelectInput')
  }

  getInitialState () {
    console.log('MultiSelectInput.getInitialState()')
    const selected = this.props.selectedOptions
    return {
      values: selected,
      editor: false
    }
  }

  setState (...args) {
    console.log('MultiSelectInput.setState()')
    super.setState(...args)
  }

  render ($$) {
    const selected = this.state.values
    const options = this.props.availableOptions
    const selectedLabels = options.reduce((labels, opt) => {
      if (selected.indexOf(opt.id) > -1) {
        labels.push(opt.text)
      }
      return labels
    }, [])

    const isEmptyValue = selectedLabels.length === 0
    const el = $$('div').addClass('sc-multi-select-input').append(
      isEmptyValue ? this.getLabel('multi-select-default-value') : selectedLabels.join('; ')
    ).on('click', this._toggleEditor)
    if (isEmptyValue) el.addClass('sm-empty')

    if (this.state.editor) {
      el.append(
        this.renderEditor($$, options)
      )
    }

    if (this.props.warning) el.addClass('sm-warning')

    return el
  }

  renderEditor ($$, options) {
    const label = this.props.name
    const selected = this.state.values
    const editorEl = $$('div').addClass('se-select-editor').append(
      $$('div').addClass('se-arrow'),
      $$('div').addClass('se-select-label').append('Choose ' + label)
    )
    options.forEach(opt => {
      const isSelected = selected.indexOf(opt.id) > -1
      const icon = isSelected ? 'fa-check-square-o' : 'fa-square-o'
      editorEl.append(
        $$('div').addClass('se-select-item').append(
          $$(FontAwesomeIcon, { icon: icon }).addClass('se-icon'),
          $$('div').addClass('se-item-label').append(opt.text).ref(opt.id)
        ).on('click', this._toggleItem.bind(this, opt.id))
      )
    })
    return editorEl
  }

  _toggleItem (itemId, event) {
    event.stopPropagation()
    const name = this.props.name
    let selected = this.state.values
    const index = selected.indexOf(itemId)
    if (index < 0) {
      selected.push(itemId)
    } else {
      selected.splice(index, 1)
    }
    this.extendState({values: selected})
    this.send('set-value', name, selected)
  }

  _toggleEditor (event) {
    event.stopPropagation()
    const isEditing = this.state.editor
    this.extendState({editor: !isEditing})
  }
}
