export default class ReferenceManager {
  constructor(dbSession, nodeId) {
    this.dbSession = dbSession
    this.nodeId = nodeId
    this.db = dbSession.getDocument()
  }

  getNode() {
    let node = this.db.get(this.nodeId)
    if (!node || node.type !== 'journal-article') {
      throw new Error('No valid article node found.')
    }
    return node
  }

  updateReferences(entityIds) {
    let node = this.getNode()
    this.dbSession.transaction(tx => {
      tx.set([node.id, 'references'], entityIds)
    })
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    let node = this.getNode()
    // TODO: determine order and label based on citations in the document
    return node.references.map((entityId, index) => {
      let entity = this.db.get(entityId)
      return {
        id: entityId,
        label: index + 1,
        type: entity.type
      }
    })
  }
}
