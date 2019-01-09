import { Component } from 'substance'
import addModelObserver from '../model/addModelObserver'
import removeModelObserver from '../model/removeModelObserver'
import getComponentForModel from './getComponentForModel'

export default class ModelComponent extends Component {
  didMount () {
    addModelObserver(this.props.model, this.rerender, this)
  }

  dispose () {
    removeModelObserver(this)
  }

  getComponentForModel (model) {
    return getComponentForModel(this.context, model)
  }
}
