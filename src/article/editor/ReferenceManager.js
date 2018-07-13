import updateEntityChildArray from '../shared/updateEntityChildArray'
import AbstractCitationManager from './AbstractCitationManager'

export default class ReferenceManager extends AbstractCitationManager {

  constructor(context) {
    super(context.editorSession, 'bibr', context.labelGenerator)

    this.pubMetaDbSession = context.pubMetaDbSession
    if(!this.pubMetaDbSession) {
      throw new Error("'pubMetaDbSession' is mandatory.")
    }
    // compute initial labels
    this._updateLabels()
  }

  updateReferences(newRefs) {
    let refList = this.editorSession.getDocument().find('ref-list')
    let oldRefs = this.getReferenceIds()
    this.editorSession.transaction(tx => {
      updateEntityChildArray(tx, refList.id, 'ref', 'rid', oldRefs, newRefs)
    })
  }

  getReferenceIds() {
    let doc = this.editorSession.getDocument()
    let refs = doc.findAll('ref-list > ref')
    return refs.map(ref => ref.getAttribute('rid'))
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    let references = this._getReferences()
    references.sort((a,b) => {
      return a.state.pos - b.state.pos
    })
    return references
  }

  // interface for EditXrefTool
  getAvailableResources() {
    return this.getBibliography()
  }

  _getReferences() {
    const doc = this.editorSession.getDocument()
    const db = this.pubMetaDbSession.getDocument()

    let refs = doc.findAll('ref-list > ref')
    // TODO: determine order and label based on citations in the document
    return refs.map((ref) => {
      let refId = ref.getAttribute('rid')
      if (!ref.state) {
        ref.state = {}
      }
      if (!ref.state.entity) {
        ref.state.entity = db.get(refId)
      }
      return ref
    })
  }

  _getBibliographyElement() {
    return this.editorSession.getDocument().find('ref-list')
  }

}
