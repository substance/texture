import _ContainerModel from './_ContainerModel'

// Note: at this higher level, 'Container' is not a very good name because ot is not very specific
// We should come up with a name that makes clear that this is something that could be editied in a classical 'word-processor'.
// I.e. the content consists of a sequence of TextBlocks as well as blocks with other typically structured content.
// As a working title I'd suggest to use the term 'flow content' which is used in HTML for exactly this type of content
export default class FlowContentModel extends _ContainerModel {
  get type () { return 'flow-content-model' }

  get id () { return this._path[0] }

  getItems () {
    return this._getItems()
  }

  addItem (item) {
    this._api._appendChild(this._path, item)
  }

  removeItem (item) {
    this._api._removeChild(this._path, item)
  }
}
