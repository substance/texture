import ValueModel from './ValueModel'

export default class ChildModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  get type () { return 'child-model' }

  getChild () {
    let id = this.getValue()
    if (id) {
      return this._api.getModelById(id)
    }
  }
}
