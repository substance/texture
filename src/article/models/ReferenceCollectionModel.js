import DefaultCollectionModel from './DefaultCollectionModel'

// TODO: is it possible to implement this collection more like the others?
export default class ReferenceCollectionModel extends DefaultCollectionModel {
  // Note: this is special because it provides a sorted list of references
  getItems () {
    let refs = this._api.getReferenceManager().getBibliography()
    let result = refs.map(ref => this._api.getModelById(ref.id))
    return result
  }

  // TODO: explain
  addItems (items) {
    return this._api.addReferences(items, this)
  }

  removeItem (item) {
    this._api.deleteReference(item, this)
  }
}
