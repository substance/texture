import { documentHelpers } from 'substance'
import ValueModel from './ValueModel'
import { isCollectionEmpty } from './modelHelpers'

export default class CollectionModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  get type () { return 'collection' }

  get isCollection () {
    return true
  }

  getItems () {
    const doc = this._api.getDocument()
    return documentHelpers.getNodesForIds(doc, this.getValue())
  }

  addItem (item) {
    // TODO: instead of requiring a bunch of low-level API
    // methods we should instead introduce a Collection API
    // where these low-level things are implemented
    // TODO: things brings me then to the point, questioning
    // the benefit of a general CollectionModel. Probably this
    // should be moved into Article API land.
    this._api._appendChild(this._path, item)
  }

  removeItem (item) {
    this._api._removeChild(this._path, item.id)
  }

  get length () { return this.getValue().length }

  getValue () {
    return super.getValue() || []
  }

  isEmpty () {
    return isCollectionEmpty(this._api, this._path)
  }

  hasTargetType (type) {
    return this._targetTypes.has(type)
  }
}
