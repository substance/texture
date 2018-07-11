import { isArray } from 'substance'
import { setModelValue, getModelSession } from './modelHelpers'

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
  resolveProperty(propertyName) {    
    let value = this._node[propertyName]
    let result
    if (isArray(value)) {
      result = value.map(targetId => this.api.getEntity(targetId))
    } else {
      result = this.api.getEntity(value)
    }
    return result
  }

  onUpdate(handler, component) {
    let session = getModelSession(this)
    session.onRender('document', handler, component, { path: [this.id] })
  }

  off (component) {
    let session = getModelSession(this)
    session.off(component)
  }
}
