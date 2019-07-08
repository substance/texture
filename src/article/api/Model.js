export default class Model {
  constructor (api) {
    this._api = api
  }

  _getValueModel (propKey) {
    return this._api.getValueModel(propKey)
  }
}
