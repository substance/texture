import _ContainerModel from './_ContainerModel'

export default class ChildrenModel extends _ContainerModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  get type () { return 'children-model' }

  getChildren () {
    return this._getItems()
  }

  appendChild (child) {
    this._api._appendChild(this._path, child)
  }

  removeChild (child) {
    this._api._removeChild(this._path, child)
  }
}
