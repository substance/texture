import { Component } from 'substance'

export default class ValueComponent extends Component {
  didMount () {
    const appState = this.context.appState
    const path = this._getPath()
    appState.addObserver(['document'], this._rerenderOnModelChange, this, {
      stage: 'render',
      document: { path }
    })
  }

  dispose () {
    const appState = this.context.appState
    appState.removeObserver(this)
  }

  // EXPERIMENTAL:
  // trying to avoid unnecessary rerenderings
  shouldRerender (newProps) {
    return newProps.model !== this.props.model
  }

  _rerenderOnModelChange () {
    // console.log('Rerendering ValueComponent after model update:', this._getPath())
    this.rerender()
  }

  _getPath () {
    return this.props.model._path
  }
}
