export default class AbstractModel {
  constructor (api) {
    this._api = api
  }

  getProperties () {
    return this._properties
  }

  getProperty (propName) {
    let properties = this.getProperties()
    return properties.find(prop => {
      return prop.name === propName
    })
  }

  getPropertyValue (propName) {
    const prop = this.getProperty(propName)
    return prop.valueModel
  }
}
