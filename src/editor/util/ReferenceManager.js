import { without } from 'substance'

export default class ReferenceManager {
  constructor(entityDb) {
    // Holds the bibliography in form of entity-ids
    this._references = []
    this.entityDb = entityDb
  }

  addReference(entityId) {
    if (this._references.indexOf(entityId) < 0) {
      this._references.push(entityId)
    } else {
      throw new Error('Reference already exists in bibliography')
    }
  }

  removeReference(entityId) {
    if (this._references.indexOf(entityId) >= 0) {
      this._references = without(this._references, entityId)
    } else {
      throw new Error('Reference does not exist in bibliography')
    }
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    // TODO: determine order and label based on citations in the document
    return this._references.map((entityId, index) => {
      let entity = this.entityDb.get(entityId)
      return {
        id: entityId,
        label: index + 1,
        type: entity.type
      }
    })
  }
}
