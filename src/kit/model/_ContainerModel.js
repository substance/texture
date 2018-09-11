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
    let ids = this.getValue()
    if (ids.length === 0) return true
    let first = this._api.getModelById(ids[0])
    if (first && first.isEmpty) {
      return first.isEmpty()
    }
    return false
  }

  _getItems () {
    return this.getValue().map(id => this._api.getModelById(id))
  }
}
