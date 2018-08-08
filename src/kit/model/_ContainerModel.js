import ValueModel from './ValueModel'

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
    return this.getValue().length === 0
  }

  _getItems () {
    return this.getValue().map(id => this._api._getModelById(id))
  }
}
