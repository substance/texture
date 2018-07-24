import { isArray } from 'substance'
import { setModelValue } from './modelHelpers'

export default class DefaultModel {
  constructor(api, node) {
    this._api = api
    this._node = node
  }

  get id() {
    return this._node.id
  }

  get type() {
    return this._node.type
  }

  get isCollection() {
    return false
  }

  toJSON() {
    return this._node.toJSON()
  }

  getNode() {
    return this._node
  }

  getSchema() {
    return this._node.getSchema()
  }

  setValue(name, value) {
    setModelValue(this, name, value)
  }

  /*
    Used to resolve references.

    TODO: is it a good name?
  */
  resolveRelationship(propertyName) {
    let value = this._node[propertyName]
    let result
    if (isArray(value)) {
      result = value.map(targetId => this._api.getEntity(targetId))
    } else {
      result = this._api.getEntity(value)
    }
    return result
  }
}
