import ValueModel from './ValueModel'

export default class ChildModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = new Set(targetTypes)
  }

  get type () { return 'child' }

  getChild () {
    return this._resolveId(this.getValue())
  }

  hasTargetType (type) {
    return this._targetTypes.has(type)
  }

  isEmpty () {
    // FIXME: formerly we have delegated to a child model (but, when is a node / composite model empty?)
    let child = this.getChild()
    return !child
  }
}
