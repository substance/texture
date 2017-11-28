export default class ReferenceManager {
  constructor(editorSession, entityDbSession) {
    this.editorSession = editorSession
    this.entityDbSession = entityDbSession
  }

  updateReferences(/*entityIds*/) {
    throw new Error('TODO: implement')
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    let doc = this.editorSession.getDocument()
    let entityDb = this.entityDbSession.getDocument()
    let refs = doc.findAll('ref-list > ref')

    // TODO: determine order and label based on citations in the document
    return refs.map((ref, index) => {
      let entity = entityDb.get(ref.id)
      return {
        id: ref.id,
        label: index + 1,
        type: entity.type
      }
    })
  }
}
