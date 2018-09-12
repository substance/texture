import { Component } from 'substance'
import OverlayMixin from './OverlayMixin'

export default class MultiSelectInput extends OverlayMixin(Component) {
  render ($$) {
    const selected = this.props.selected
    const isEmpty = selected.length === 0
    const selectedLabels = selected.map(item => item.toString())
    const isExpanded = this._canShowOverlay()
    const label = isEmpty ? this.getLabel('multi-select-default-value') : selectedLabels.join('; ')

    const el = $$('div').addClass('sc-multi-select-input')
    if (isEmpty) el.addClass('sm-empty')
    el.addClass(isExpanded ? 'sm-expanded' : 'sm-collapsed')
    el.append(
      $$('div').addClass('se-label').text(label)
    )

    if (isExpanded) {
      el.addClass('sm-active')
      el.append(
        this.renderValues($$)
      )
    }
    el.on('click', this._toggleOverlay)

    return el
  }

  renderValues ($$) {
    const label = this.props.label
    const selected = this.props.selected
    const selectedIdx = selected.map(item => item.id)
    const options = this._getOptions()
    const editorEl = $$('div').addClass('se-select-editor').append(
      $$('div').addClass('se-arrow'),
      $$('div').addClass('se-select-label')
        .append(label)
    )
    options.forEach(option => {
      const isSelected = selectedIdx.indexOf(option.id) > -1
      const icon = isSelected ? 'checked-item' : 'unchecked-item'
      editorEl.append(
        $$('div').addClass('se-select-item').addClass(isSelected ? 'sm-selected' : '').append(
          this.context.iconProvider.renderIcon($$, icon).addClass('se-icon'),
          $$('div').addClass('se-item-label')
            // TODO: I would like to have this implementation more agnostic of a specific data structure
            .append(option.toString()).ref(option.id)
        ).on('click', this._toggleItem.bind(this, option))
      )
    })
    return editorEl
  }

  _getOverlayId () {
    return this.props.overlayId || this.getId()
  }

  _getOptions () {
    return this.getParent().getAvailableOptions()
  }

  _toggleItem (option, event) {
    event.stopPropagation()
    this.send('toggleOption', option)
  }

  _toggleOverlay (event) {
    event.preventDefault()
    event.stopPropagation()
    super._toggleOverlay()
  }
}
