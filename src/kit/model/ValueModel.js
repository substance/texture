import { isNil } from 'substance'

export default class ValueModel {
  constructor (api, path) {
    this._api = api
    this._path = path
  }

  get id () {
    return String(this._path)
  }

  getValue () {
    return this._api._getValue(this._path)
  }

  setValue (val) {
    this._api._setValue(this._path, val)
  }

  isEmpty () {
    return isNil(this.getValue())
  }

  get _value () { return this.getValue() }
}
