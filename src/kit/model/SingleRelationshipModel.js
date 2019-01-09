import _RelationshipModel from './_RelationshipModel'

export default class SingleRelationshipModel extends _RelationshipModel {
  get type () { return 'single-relationship' }

  toggleTarget (target) {
    let currentTargetId = this.getValue()
    let newTargetId
    if (currentTargetId === target.id) {
      newTargetId = undefined
    } else {
      newTargetId = target.id
    }
    this._api.getEditorSession().transaction(tx => {
      let path = this._path
      tx.set(path, newTargetId)
      tx.setSelection(this._api._createValueSelection(path))
    })
  }
}
