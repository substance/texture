import ValueModel from './ValueModel'
import { isFlowContentEmpty } from './modelHelpers'

export default class _ContainerModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  get length () { return this.getValue().length }

  getValue () {
    return super.getValue() || []
  }

  isEmpty () {
    return isFlowContentEmpty(this._api, this._path)
  }

  _getItems () {
    return this.getValue().map(id => this._api.getModelById(id))
  }
}
