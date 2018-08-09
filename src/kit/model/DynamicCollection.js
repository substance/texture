import { map } from 'substance'

export default class DynamicCollection {
  constructor (api, type) {
    this._api = api
    this._type = type
  }

  get type() {
    return this._type
  }

  getItems () {
    const api = this._api
    const doc = api._getDocument()
    const index = doc.getIndex('type')
    const nodesById = index.get(this._type)
    const items = map(nodesById, node => {
      return api._getModelForNode(node)
    })
    return items
  }

  addItem (item) {
    const api = this._api
    const model = api._addModel(item)
    return model
  }

  removeItem (item) {
    const api = this._api
    const model = api._removeModel(item)
    return model
  }
}
