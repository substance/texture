import { Component } from 'substance'
import addModelObserver from './addModelObserver'
import removeModelObserver from './removeModelObserver'

export default class ModelComponent extends Component {
  didMount () {
    addModelObserver(this.props.model, this.rerender, this, {
      stage: 'render'
    })
  }

  dispose () {
    removeModelObserver(this)
  }
}
