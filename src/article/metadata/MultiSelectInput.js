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
    const valueEl = $$('div').addClass('se-value')
    if(isEmptyValue) valueEl.addClass('sm-empty')

    if (isEmptyValue) {
      valueEl.addClass('sm-empty')
      valueEl.append(this.getLabel('multi-select-default-value'))
    } else {
      selectedLabels.forEach(label => {
        valueEl.append(
          $$('div').addClass('se-option').text(label)
        )
      })
    }

    const el = $$('div').addClass('sc-multi-select-input').append(
      $$('div').addClass('se-label').append(label),
      valueEl.on('click', this._toggleEditor)
    )

    if(this.state.editor) {
      el.append(
        this.renderEditor($$, options)
      )
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
          $$('div').addClass('se-item-label').append(opt.text).ref(opt.id)
        ).on('click', this._toggleItem.bind(this, opt.id))
      )
    })

    return editorEl
  }

  _toggleItem(itemId) {
    const name = this.props.name
    let selected = this.state.values
    const index = selected.indexOf(itemId)
    if(index < 0) {
      selected.push(itemId)
    } else {
      selected.splice(index, 1)
    }
    this.extendState({values: selected})
    this.send('set-value', name, selected)
  }

  _toggleEditor() {
    const isEditing = this.state.editor
    this.extendState({editor: !isEditing})
  }
}