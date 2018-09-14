import ModelProperty from './ModelProperty'

export default class CompositeModel {
  constructor (api, ...properties) {
    this._api = api
    this._properties = properties
  }

  get type () { return 'composite-model' }

  get _isCompositeModel () { return true }

  getProperties () {
    return this._properties
  }

  getProperty (propName) {
    return this._properties.find(prop => {
      return prop.name === propName
    })
  }

  getPropertyValue (propName) {
    const prop = this.getProperty(propName)
    return prop.valueModel
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
