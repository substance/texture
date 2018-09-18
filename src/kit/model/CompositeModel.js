import ModelProperty from './ModelProperty'
import AbstractModel from './AbstractModel'

export default class CompositeModel extends AbstractModel {
  constructor (api, ...properties) {
    super(api)
    this._properties = properties
  }

  get type () { return 'composite-model' }

  get _isCompositeModel () { return true }

  // getProperties () {
  //   return this._properties
  // }

  // getProperty (propName) {
  //   return this._properties.find(prop => {
  //     return prop.name === propName
  //   })
  // }

  // getPropertyValue (propName) {
  //   const prop = this.getProperty(propName)
  //   return prop.valueModel
  // }

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
