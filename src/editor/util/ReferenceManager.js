import updateEntityChildArray from '../../util/updateEntityChildArray'

export default class ReferenceManager {
  constructor(editorSession, entityDbSession) {
    this.editorSession = editorSession
    this.entityDbSession = entityDbSession
  }

  updateReferences(newRefs) {
    let refList = this.editorSession.getDocument().find('ref-list')
    let oldRefs = this.getReferenceIds()
    updateEntityChildArray(this.editorSession, refList.id, 'ref', 'id', oldRefs, newRefs)
  }

  getReferenceIds() {
    let doc = this.editorSession.getDocument()
    let refs = doc.findAll('ref-list > ref')
    return refs.map(ref => ref.id)
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    let entityDb = this.entityDbSession.getDocument()
    let refs = this.getReferenceIds()

    // TODO: determine order and label based on citations in the document
    return refs.map((refId, index) => {
      let entity = entityDb.get(refId)
      return {
        id: refId,
        label: index + 1,
        type: entity.type
      }
    })
  }
}
