import { Component } from 'substance'
import OverlayMixin from './OverlayMixin'

export default class KeywordInput extends OverlayMixin(Component) {
  getInitialState () {
    return {
      isExpanded: this._canShowOverlay()
    }
  }

  willReceiveProps () {
    this.extendState(this.getInitialState())
  }

  render ($$) {
    const values = this.props.values
    const isEmpty = values.length === 0
    const isExpanded = this.state.isExpanded

    const el = $$('div').addClass('sc-keyword-input')
    if (isEmpty) el.addClass('sm-empty')
    el.addClass(isExpanded ? 'sm-expanded' : 'sm-collapsed')
    el.append(
      $$('div').addClass('se-label').text(values.join(', '))
    )
    if (isExpanded) {
      el.addClass('sm-active')
      el.append(
        this._renderEditor($$)
      )
    }
    el.on('click', this._onClick)
      .on('dblclick', this._stopAndPreventDefault)
      .on('mousedown', this._stopAndPreventDefault)

    return el
  }

  _renderEditor ($$) {
    const values = this.props.values
    const editorEl = $$('div').ref('editor').addClass('se-keyword-editor')
    values.forEach(value => {
      editorEl.append(
        $$('div').addClass('se-keyword').append(
          $$('div').addClass('se-keyword-input').append(value),
          this.context.iconProvider.renderIcon($$, 'remove-button').addClass('se-icon')
            .on('click', this._removeKeyword)
        )
      )
    })
    return editorEl
  }

  _getOverlayId () {
    return this.props.overlayId || this.getId()
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
}
