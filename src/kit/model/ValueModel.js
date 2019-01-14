import { isNil } from 'substance'
import { throwMethodIsAbstract } from '../shared'

export default class ValueModel {
  constructor (api, path) {
    this._api = api
    this._path = path
  }

  get id () {
    return String(this._path)
  }

  get type () {
    throwMethodIsAbstract()
  }

  getPath () {
    return this._path
  }

  hasTargetType (name) {
    return false
  }

  getValue () {
    return this._api.getDocument().get(this._path)
  }

  setValue (val) {
    this._api.getEditorSession().transaction(tx => {
      tx.set(this._path, val)
    })
  }

  getSchema () {
    return this._api.getDocument().getProperty(this._path)
  }

  isEmpty () {
    return isNil(this.getValue())
  }

  _resolveId (id) {
    return this._api.getDocument().get(id)
  }

  get _value () { return this.getValue() }

  get _isValue () { return true }
}
