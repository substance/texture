import ValueModel from './ValueModel'

// TODO: this does not seem to be the right approach
// We have taken this too far, i.e. trying to generate an editor
// for reference properties without ownership (aka relationships)
export default class _RelationshipModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  hasTargetType (type) {
    return this._targetTypes.has(type)
  }

  getAvailableOptions () {
    return this._api._getAvailableOptions(this)
  }
}
