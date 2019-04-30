import { Component } from 'substance'
import OverlayMixin from './OverlayMixin'
import Popup from './Popup'

export default class MultiSelectInput extends OverlayMixin(Component) {
  getInitialState () {
    return {
      isExpanded: this._canShowOverlay()
    }
  }

  willReceiveProps () {
    this.extendState(this.getInitialState())
  }

  render ($$) {
    const selected = this.props.selected
    const isEmpty = selected.length === 0
    const selectedLabels = selected.map(item => item.toString())
    const isExpanded = this.state.isExpanded
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
        this._renderOptions($$)
      )
    }
    el.on('click', this._onClick)
      .on('dblclick', this._stopAndPreventDefault)
      .on('mousedown', this._stopAndPreventDefault)

    return el
  }

  _renderOptions ($$) {
    const label = this.props.label
    const selected = this.props.selected
    const selectedIdx = selected.map(item => item.id)
    const options = this._getOptions()
    const editorEl = $$('div').ref('options').addClass('se-select-editor')
    options.forEach(option => {
      const isSelected = selectedIdx.indexOf(option.id) > -1
      const icon = isSelected ? 'checked-item' : 'unchecked-item'
      editorEl.append(
        $$('div').addClass('se-select-item').addClass(isSelected ? 'sm-selected' : '').append(
          this.context.iconProvider.renderIcon($$, icon).addClass('se-icon'),
          $$('div').addClass('se-item-label')
            // TODO: I would like to have this implementation more agnostic of a specific data structure
            .append(option.toString()).ref(option.id)
        ).on('click', this._onToggleItem.bind(this, option))
      )
    })
    return $$(Popup, { label }).append(editorEl)
  }

  _getOptions () {
    return this.getParent().getAvailableOptions()
  }

  // toggleOption (event) {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   super._toggleOverlay()
  // }

  _stopAndPreventDefault (event) {
    event.stopPropagation()
    event.preventDefault()
  }

  _onClick (event) {
    this._stopAndPreventDefault(event)
    super._toggleOverlay()
  }

  _onOverlayIdHasChanged () {
    let overlayId = this.context.appState.overlayId
    let id = this._getOverlayId()
    let needUpdate = false
    if (this.state.isExpanded) {
      needUpdate = (overlayId !== id)
    } else {
      needUpdate = (overlayId === id)
    }
    if (needUpdate) {
      this.extendState(this.getInitialState())
    }
  }

  _onToggleItem (option, event) {
    event.stopPropagation()
    event.preventDefault()
    this.send('toggleOption', option)
  }
}
