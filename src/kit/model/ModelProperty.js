export default class ModelProperty {
  constructor (name, valueModel) {
    this._name = name
    this._valueModel = valueModel
  }

  get name () {
    return this._name
  }

  get valueModel () {
    return this._valueModel
  }

  get _isModelProperty () { return true }
}
