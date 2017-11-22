export default class ReferenceManager {
  constructor(dbSession, articleId) {
    this.dbSession = dbSession
    this.db = dbSession.getDocument()
    this.node = this.db.get(articleId)
  }

  updateReferences(entityIds) {
    this.dbSession.transaction(tx => {
      tx.set([this.node.id, 'references'], entityIds)
    })
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    // TODO: determine order and label based on citations in the document
    return this.node.references.map((entityId, index) => {
      let entity = this.db.get(entityId)
      return {
        id: entityId,
        label: index + 1,
        type: entity.type
      }
    })
  }
}
