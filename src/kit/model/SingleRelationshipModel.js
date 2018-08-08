import _RelationshipModel from './_RelationshipModel'

export default class SingleRelationshipModel extends _RelationshipModel {
  get type () { return 'single-relationship-model' }

  toggleTarget (target) {
    let currentTargetId = this.getValue()
    let newTargetId
    if (currentTargetId === target.id) {
      newTargetId = undefined
    } else {
      newTargetId = target.id
    }
    this._api._setValue(this._path, newTargetId)
  }
}
