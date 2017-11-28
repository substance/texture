export default class ReferenceManager {
  constructor(editorSession, entityDbSession, nodeId) {
    this.editorSession = editorSession
    this.entityDbSession = entityDbSession
    this.nodeId = nodeId
  }

  getNode() {
    let doc = this.editorSession.getDocument()
    let node = doc.get(this.nodeId)
    if (!node || node.type !== 'journal-article') {
      throw new Error('No valid article node found.')
    }
    return node
  }

  updateReferences(entityIds) {
    let node = this.getNode()
    this.editorSession.transaction(tx => {
      tx.set([node.id, 'references'], entityIds)
    })
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    let node = this.getNode()
    let entityDb = this.entityDbSession.getDocument()
    // TODO: determine order and label based on citations in the document
    return node.references.map((entityId, index) => {
      let entity = entityDb.get(entityId)
      return {
        id: entityId,
        label: index + 1,
        type: entity.type
      }
    })
  }
}
