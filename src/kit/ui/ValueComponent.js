import { Component, getKeyForPath } from 'substance'

export default class ValueComponent extends Component {
  constructor (...args) {
    super(...args)

    if (!this.props.path) throw new Error('"path" is required')
  }

  didMount () {
    const appState = this.context.editorState
    const path = this._getPath()
    appState.addObserver(['document'], this._rerenderOnModelChange, this, {
      stage: 'render',
      document: { path }
    })
  }

  dispose () {
    const appState = this.context.editorState
    appState.removeObserver(this)
  }

  shouldRerender (newProps) {
    return getKeyForPath(newProps.path) !== getKeyForPath(this._getPath())
  }

  _rerenderOnModelChange () {
    // console.log('Rerendering ValueComponent after model update:', this._getPath())
    this.rerender()
  }

  _getDocument () {
    return this.context.editorState.document
  }

  _getPath () {
    return this.props.path
  }

  _getValue () {
    const document = this._getDocument()
    return document.get(this._getPath())
  }

  _setValue (val) {
    const path = this._getPath()
    const api = this.context.api
    api.setValue(path, val)
  }
}
