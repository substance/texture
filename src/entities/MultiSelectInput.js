import { Component, FontAwesomeIcon } from 'substance'

export default class MultiSelectInput extends Component {
  getInitialState() {
    const selected = this.props.selectedOptions
    return {
      values: selected,
      editor: false
    }
  }

  render($$) {
    const label = this.props.label
    const selected = this.state.values
    const options = this.props.availableOptions
    const selectedLabels = options.reduce((labels, opt) => {
      if(selected.indexOf(opt.id) > -1) {
        labels.push(opt.text) 
      }
      return labels
    }, [])

    const isEmptyValue = selectedLabels.length === 0
    const valuelEl = $$('div').addClass('se-value').append(
      isEmptyValue ? this.getLabel('multi-select-default-value') : selectedLabels.join(', ')
    )
    if(isEmptyValue) valuelEl.addClass('sm-empty')

    const el = $$('div').addClass('sc-multi-select-input').append(
      $$('div').addClass('se-label').append(label),
      valuelEl.on('click', this._toggleEditor)
    )

    if(this.state.editor) {
      el.append(this.renderEditor($$, options))
    }

    return el
  }

  renderEditor($$, options) {
    const label = this.props.label
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
          $$('div').addClass('se-item-label').append(opt.text)
        ).on('click', this._toggleItem.bind(this, opt.id))
      )
    })

    return editorEl
  }

  _toggleItem(itemId) {
    let selected = this.state.values
    const index = selected.indexOf(itemId)
    if(index < 0) {
      selected.push(itemId)
    } else {
      selected.splice(index, 1)
    }
    this.extendState({values: selected})
    this.send('updatedSelection', selected)
  }

  _toggleEditor() {
    const isEditing = this.state.editor
    this.extendState({editor: !isEditing})
  }
}