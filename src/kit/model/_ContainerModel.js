import { documentHelpers } from 'substance'
import ValueModel from './ValueModel'
import { isFlowContentEmpty } from './modelHelpers'

export default class _ContainerModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = new Set(targetTypes)
  }

  get length () { return this.getValue().length }

  getValue () {
    return super.getValue() || []
  }

  isEmpty () {
    return isFlowContentEmpty(this._api, this._path)
  }

  hasTargetType (type) {
    return this._targetTypes.has(type)
  }

  _getItems () {
    const doc = this._api.getDocument()
    return documentHelpers.getNodesForIds(doc, this.getValue())
  }
}
