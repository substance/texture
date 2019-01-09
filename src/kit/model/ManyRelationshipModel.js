import _RelationshipModel from './_RelationshipModel'

export default class ManyRelationshipModel extends _RelationshipModel {
  get type () { return 'many-relationship' }

  getValue () {
    return super.getValue() || []
  }

  isEmpty () {
    return this.getValue().length === 0
  }

  toggleTarget (target) {
    this._api._toggleRelationship(this._path, target.id)
  }
}
