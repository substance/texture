import { CustomSurface, getKeyForPath, domHelpers, keys, last } from 'substance'
import { Popup, TextInput } from '../../kit'

/**
 * Experimental: this is the first example of an overlay that itself
 * hosts Surfaces, similar to an IsolatedNodeComponent.
 * Thus we are applying the same strategy regarding selections and surfaceId.
 */
export default class KeywordInput extends CustomSurface {
  // HACK: keyboard handling between TextInputs and the
  // native input is pretty hacky, and should be approached differently
  getActionHandlers () {
    return {
      select: this._select
    }
  }

  getInitialState () {
    return {
      isSelected: false,
      isExpanded: false
    }
  }

  didMount () {
    super.didMount()

    let appState = this.context.appState
    appState.addObserver(['selection'], this._onSelectionHasChanged, this, { stage: 'render' })
  }

  dispose () {
    super.dispose()

    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const doc = this.context.doc
    const model = this.props.model
    const values = model.getValue()
    const isEmpty = values.length === 0
    const isSelected = this.state.isSelected
    const isExpanded = this.state.isExpanded
    const label = isEmpty ? this.props.placeholder : values.map(v => doc.get([v, 'content'])).join(', ')

    const el = $$('div').addClass('sc-keyword-input')
    if (isEmpty) el.addClass('sm-empty')
    if (isSelected) {
      el.addClass('sm-active')
    }
    el.addClass(isExpanded ? 'sm-expanded' : 'sm-collapsed')
    el.append(
      $$('div').addClass('se-label').text(label)
        .on('click', this._onClick)
    )
    if (isExpanded) {
      el.append(
        this._renderEditor($$)
      )
    }
    el.on('mousedown', domHelpers.stopAndPrevent)
      .on('mouseup', domHelpers.stopAndPrevent)
      .on('click', domHelpers.stopAndPrevent)
      .on('dblclick', domHelpers.stopAndPrevent)
      .on('keydown', this._onKeydown)

    return el
  }

  _renderEditor ($$) {
    const model = this.props.model
    const metadataValues = model.getItems()
    const placeholder = this.getLabel('enter-keyword')

    const Button = this.getComponent('button')
    const Input = this.getComponent('input')

    const editorEl = $$('div').ref('editor').addClass('se-keyword-editor')
    let lastIdx = metadataValues.length - 1
    metadataValues.forEach((value, idx) => {
      const path = [value.id, 'content']
      const name = getKeyForPath(path)
      let isFirst = idx === 0
      let isLast = idx === lastIdx
      let input = $$(_HackedTextInput, {
        name,
        path,
        placeholder,
        isFirst,
        isLast
      }).ref(value.id)
      editorEl.append(
        $$('div').addClass('se-keyword').append(
          $$('div').addClass('se-keyword-input').append(
            input
          ),
          this._renderIcon($$, 'trash').on('click', this._removeKeyword.bind(this, value))
        )
      )
    })
    editorEl.append(
      $$('div').addClass('se-keyword').append(
        $$('div').addClass('se-keyword-input').append(
          $$(Input, {
            placeholder,
            handleEscape: false
          }).ref('newKeywordInput')
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

  _getCustomResourceId () {
    return this.props.model.id
  }

  _onClick (event) {
    domHelpers.stopAndPrevent(event)
    if (!this.state.isSelected || !this.state.isExpanded) {
      this._select(true)
    } else if (this.state.isExpanded) {
      this._select(false)
    }
  }

  _onKeydown (event) {
    // console.log('### _onKeydown()', event)
    event.stopPropagation()
    if (event.keyCode === keys.ESCAPE) {
      event.preventDefault()
      this._ensureIsCollapsed()
    }
  }

  _onNewKeywordKeydown (event) {
    // console.log('### _onNewKeywordKeydown()', event)
    if (event.keyCode === keys.ENTER) {
      event.stopPropagation()
      event.preventDefault()
      this._addKeyword()
      this._select(true)
    } else if (event.keyCode === keys.UP) {
      event.stopPropagation()
      event.preventDefault()
      this._selectLast()
    } else if (event.keyCode === keys.TAB) {
      event.stopPropagation()
      event.preventDefault()
      if (event.shiftKey) {
        this._selectLast()
      }
    } else if (event.keyCode === keys.ESCAPE) {
      event.preventDefault()
      this.refs.newKeywordInput.val('')
    }
  }

  _onSelectionHasChanged (sel) {
    let surfaceId = sel.surfaceId
    if (surfaceId && surfaceId.startsWith(this._surfaceId)) {
      if (sel.isCustomSelection()) {
        let isExpanded = sel.data.isExpanded
        if (!this.state.isSelected) {
          this.extendState({
            isSelected: true,
            isExpanded
          })
        } else if (this.state.isExpanded !== isExpanded) {
          this.extendState({
            isExpanded
          })
        }
      } else {
        this._ensureIsExpanded()
      }
    } else if (this.state.isSelected) {
      this.extendState({ isSelected: false, isExpanded: false })
    }
  }

  rerenderDOMSelection () {
    let sel = this.context.appState.selection
    if (sel.isCustomSelection()) {
      if (sel.data.isExpanded) {
        this._ensureIsExpanded()
        this._focusNewKeyworkInput()
      } else {
        this._ensureIsCollapsed()
      }
    } else {
      this._ensureIsExpanded()
      this.context.parentSurface.rerenderDOMSelection()
    }
  }

  _ensureIsExpanded () {
    if (!this.state.isExpanded) {
      this.extendState({
        isExpanded: true
      })
    }
  }

  _ensureIsCollapsed () {
    if (this.state.isExpanded) {
      this.extendState({
        isExpanded: false
      })
    }
  }

  _addKeyword () {
    const keyword = this.refs.newKeywordInput.val()
    this.refs.newKeywordInput.val('')
    if (keyword) {
      this.send('addValue', keyword)
    }
  }

  _removeKeyword (value) {
    const model = this.props.model
    const path = model.getPath()
    this.send('executeCommand', 'remove-keyword', { path, nodeId: value, surfaceId: this._surfaceId })
  }

  _focusNewKeyworkInput () {
    if (this.state.isExpanded) {
      this.refs['newKeywordInput'].focus()
    }
  }

  _select (isExpanded) {
    const model = this.props.model
    this.context.editorSession.setSelection({
      type: 'custom',
      customType: 'keywordInput',
      nodeId: model._path[0],
      data: { isExpanded },
      surfaceId: this._surfaceId
    })
  }

  _selectLast () {
    let model = this.props.model
    let ids = model.getValue()
    let lastId = last(ids)
    let surface = this.refs[lastId]
    if (surface) {
      this.context.editorSession.setSelection({
        type: 'property',
        path: surface.props.path,
        startOffset: 0,
        surfaceId: surface.getSurfaceId()
      })
    }
  }
}

// TODO: try to make TextInput better customizable so
// that it is easier to override specific keyboard handlers
// The biggest problem we have is, that some fields are Surfaces
// and the one for the new keyword is just a plain input.
// I tried using a Surface for that too, but this requires the
// value to exist in the model. Maybe, it would still be interesting
// create something that is Surface compatible, but does not need
// a real value in the model, or allows to bind it to a 'volatile' one.
class _HackedTextInput extends TextInput {
  _handleTabKey (event) {
    event.stopPropagation()
    if (this.props.isLast) {
      if (event.shiftKey) {
        this.__handleTab(event)
      } else {
        event.preventDefault()
        this._select(true)
      }
    } else if (this.props.isFirst) {
      if (event.shiftKey) {
        event.preventDefault()
      } else {
        this.__handleTab(event)
      }
    } else {
      this.__handleTab(event)
    }
  }

  _handleUpOrDownArrowKey (event) {
    event.stopPropagation()
    if (this.props.isLast && event.keyCode === keys.DOWN) {
      // skip so that the cursor stays within this overlay
      event.preventDefault()
      this._select(true)
    } else if (this.props.isFirst && event.keyCode === keys.UP) {
      // skip so that the cursor stays within this overlay
      event.preventDefault()
    } else {
      super._handleUpOrDownArrowKey(event)
    }
  }

  _select (isExpanded) {
    this.send('select', isExpanded)
  }
}
