import { without } from 'substance'

export default class ReferenceManager {
  constructor(editorSession, entityDbSession) {
    this.editorSession = editorSession
    this.entityDbSession = entityDbSession
  }

  updateReferences(newRefs) {
    let oldRefs = this.getReferenceIds()
    let addedRefs = without(newRefs, ...oldRefs)
    let removedRefs = without(oldRefs, ...newRefs)

    this.editorSession.transaction(tx => {
      let refList = tx.find('ref-list')
      // Remove removedRefs
      removedRefs.forEach(refId => {
        let ref = tx.get(refId)
        refList.removeChild(ref)
      })
      // Create addedRefs
      addedRefs.forEach(refId => {
        let ref = tx.get(refId)
        if (!ref) {
          ref = tx.createElement('ref', { id: refId })
        }
        refList.appendChild(ref)
      })
    })
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
