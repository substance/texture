import { Component } from 'substance'

export default class ValueComponent extends Component {
  didMount () {
    const appState = this.context.appState
    const path = this.props.model._path
    appState.addObserver(['document'], this.rerender, this, {
      stage: 'render',
      document: { path }
    })
  }

  dispose () {
    const appState = this.context.appState
    appState.removeObserver(this)
  }
}
