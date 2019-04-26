import { Component, getKeyForPath } from 'substance'
import OverlayMixin from './OverlayMixin'
import TextInput from './TextInput'

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
    const model = this.props.model
    const values = model.getValue()
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
    const model = this.props.model
    const values = model.getValue()
    const placeholder = this.props.placeholder
    const Button = this.getComponent('button')
    const editorEl = $$('div').ref('editor').addClass('se-keyword-editor')
    values.forEach((value, idx) => {
      const path = model.getPath().concat(idx)
      const name = getKeyForPath(path)
      editorEl.append(
        $$('div').addClass('se-keyword').append(
          $$('div').addClass('se-keyword-input').append(
            $$(TextInput, {
              name,
              path,
              placeholder
            })
          ),
          this._renderIcon($$, 'trash').on('click', this._removeKeyword.bind(this, idx))
        )
      )
    })
    editorEl.append(
      $$('div').addClass('se-keyword-input').append(''),
      $$(Button, {
        label: this.getLabel('create')
      }).addClass('se-create-value')
        .on('click', this._addKeyword)
    )
    return editorEl
  }

  _renderIcon ($$, iconName) {
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, iconName)
    )
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

  _addKeyword () {
    
  }

  _removeKeyword (idx) {
    const values = this.props.values
    values.splice(idx, 1)
    this.send('updateValues', values)
  }
}