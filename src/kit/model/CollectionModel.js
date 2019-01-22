import { documentHelpers } from 'substance'
import ValueModel from './ValueModel'
import { isCollectionEmpty } from './modelHelpers'

export default class CollectionModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = new Set(targetTypes)
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
    this._api._appendChild(this._path, item)
  }

  get length () { return this.getValue().length }

  // TODO: this is not used ATM
  // we should either remove both addItem() and removeItem()
  // or use it consistently
  // removeItem (item) {
  //   this._api._removeChild(this._path, item)
  // }

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
