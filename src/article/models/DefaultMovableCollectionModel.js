import DefaultCollectionModel from './DefaultCollectionModel'

export default class DefaultMovableCollectionModel extends DefaultCollectionModel {
  get length () {
    return this._node.children.length
  }

  get isMovable () {
    return true
  }

  moveDown (item) {
    const pos = this._getModelPosition(item)
    if (pos < this._node.getChildCount()) {
      this.moveItem(pos, pos + 1)
    }
  }

  moveUp (item) {
    const pos = this._getModelPosition(item)
    if (pos > 0) {
      this.moveItem(pos, pos - 1)
    }
  }

  moveItem (from, to) {
    return this._api.moveCollectionItem(this, from, to)
  }

  _getModelPosition (item) {
    return this._node.getChildPosition(item)
  }
}
