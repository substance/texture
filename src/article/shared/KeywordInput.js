import { Component, getKeyForPath, domHelpers, keys } from 'substance'
import { OverlayMixin, Popup, TextInput } from '../../kit'

/**
 * Experimental: this is the first example of an overlay that itself
 * hosts Surfaces, similar to an IsolatedNodeComponent.
 * Thus we are applying the same strategy regarding selections and surfaceId.
 */
export default class KeywordInput extends OverlayMixin(Component) {
  constructor (...args) {
    super(...args)

    this._surfaceId = this.context.parentSurfaceId + '/' + this._getOverlayId()
  }
  getInitialState () {
    return {
      isExpanded: this._canShowOverlay()
    }
  }

  getChildContext () {
    return Object.assign(super.getChildContext(), {
      parentSurfaceId: this._surfaceId
    })
  }

  didMount () {
    super.didMount()

    let appState = this.context.appState
    appState.addObserver(['selection'], this._onSelectionHasChanged, this, { stage: 'render' })

    this._focusNewKeyworkInput()
  }

  dispose () {
    super.dispose()

    this.context.appState.removeObserver(this)
  }

  didUpdate (oldProps, oldState) {
    if (!oldState.isExpanded) {
      this._focusNewKeyworkInput()
    }
  }

  render ($$) {
    const doc = this.context.doc
    const model = this.props.model
    const values = model.getValue()
    const isEmpty = values.length === 0
    const isExpanded = this.state.isExpanded
    const label = isEmpty ? this.props.placeholder : values.map(v => doc.get([v, 'content'])).join(', ')

    const el = $$('div').addClass('sc-keyword-input')
    if (isEmpty) el.addClass('sm-empty')
    el.addClass(isExpanded ? 'sm-expanded' : 'sm-collapsed')
    el.append(
      $$('div').addClass('se-label').text(label)
        .on('click', this._onClick)
    )
    if (isExpanded) {
      el.addClass('sm-active')
      el.append(
        this._renderEditor($$)
      )
    }
    el.on('mousedown', domHelpers.stop)
      .on('mouseup', domHelpers.stop)
      .on('click', domHelpers.stop)
      .on('dblclick', domHelpers.stop)

    return el
  }

  _renderEditor ($$) {
    const model = this.props.model
    const metadataValues = model.getValue()
    const placeholder = this.getLabel('enter-keyword')

    const Button = this.getComponent('button')
    const Input = this.getComponent('input')

    const editorEl = $$('div').ref('editor').addClass('se-keyword-editor')
    let lastIdx = metadataValues.length - 1
    metadataValues.forEach((value, idx) => {
      const path = [value, 'content']
      const name = getKeyForPath(path)
      editorEl.append(
        $$('div').addClass('se-keyword').append(
          $$('div').addClass('se-keyword-input').append(
            $$(_HackedTextInput, {
              name,
              path,
              placeholder,
              isLast: idx === lastIdx
            })
          ),
          this._renderIcon($$, 'trash').on('click', this._removeKeyword.bind(this, value))
        )
      )
    })
    editorEl.append(
      $$('div').addClass('se-keyword').append(
        $$('div').addClass('se-keyword-input').append(
          $$(Input, { placeholder }).ref('newKeywordInput')
            .attr({ tabindex: '2' })
            .on('keydown', this._onNewKeywordKeydown)
        ),
        $$(Button).append(
          this.getLabel('create')
        ).addClass('se-create-value')
          .on('click', this._addKeyword)
      )
    )
    return $$(Popup).append(editorEl)
  }

  _renderIcon ($$, iconName) {
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, iconName)
    )
  }

  _onClick (event) {
    domHelpers.stopAndPrevent(event)
    super._toggleOverlay()
  }

  _onNewKeywordKeydown (event) {
    // TODO: maybe use the parseKeyEvent + parseKeyCombo trick to have exactly only reaction on ENTER without modifiers
    if (event.keyCode === keys.ENTER) {
      event.stopPropagation()
      event.preventDefault()
      this._addKeyword()
    }
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

  _onSelectionHasChanged (sel) {
    let surfaceId = sel.surfaceId
    if (surfaceId && surfaceId.startsWith(this._surfaceId)) {
      if (!this.state.isExpanded) {
        this.extendState({ isExpanded: true })
      }
    } else if (this.state.isExpanded) {
      this.extendState({ isExpanded: false })
    }
  }

  _addKeyword () {
    const keyword = this.refs.newKeywordInput.val()
    this.send('addValue', keyword)
  }

  _removeKeyword (value) {
    const model = this.props.model
    const path = model.getPath()
    this.send('executeCommand', 'remove-keyword', { path, value })
  }

  _focusNewKeyworkInput () {
    if (this.state.isExpanded) {
      this.refs['newKeywordInput'].focus()
    }
  }
}

class _HackedTextInput extends TextInput {
  _handleTabKey (event) {
    event.stopPropagation()
    if (!event.shiftKey && !this.props.isLast) {
      this.__handleTab(event)
    }
  }
}
