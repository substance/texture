import ModelProperty from './ModelProperty'

export default class CompositeModel {
  constructor (api, ...properties) {
    this._api = api
    this._properties = properties
  }

  get type () { return 'composite-model' }

  getProperties () {
    return this._properties
  }

  setProperties (...properties) {
    this._properties = properties.map(p => {
      if (p._isModelProperty) {
        return p
      } else {
        return new ModelProperty(p.name, p.model)
      }
    })
  }
}
