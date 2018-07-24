import { Component } from 'substance'

export default class ModelComponent extends Component {
  didMount () {
    const appState = this.context.appState
    const id = this.props.model.id
    appState.addObserver(['document'], this.rerender, this, {
      stage: 'render',
      document: {
        path: [id]
      }
    })
  }

  dispose () {
    const appState = this.context.appState
    appState.removeObserver(this)
  }
}
