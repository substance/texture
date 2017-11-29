import updateEntityChildArray from '../../util/updateEntityChildArray'
import AbstractCitationManager from './AbstractCitationManager'

export default class ReferenceManager extends AbstractCitationManager {

  constructor(context) {
    super(context.editorSession, 'bibr', context.configurator.getLabelGenerator('references'))

    this.entityDbSession = context.entityDbSession
    if(!this.entityDbSession) {
      throw new Error("'entityDbSession' is mandatory.")
    }

    // compute initial labels
    this._updateLabels()
  }

  updateReferences(newRefs) {
    let refList = this.editorSession.getDocument().find('ref-list')
    let oldRefs = this.getReferenceIds()
    updateEntityChildArray(this.editorSession, refList.id, 'ref', 'rid', oldRefs, newRefs)
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
    return this._getReferences().sort((a,b) => {
      return a.state.pos > b.state.pos
    })
  }

  // interface for EditXrefTool
  getAvailableResources() {
    return this.getBibliography()
  }

  _getReferences() {
    const doc = this.editorSession.getDocument()
    const entityDb = this.entityDbSession.getDocument()

    let refs = doc.findAll('ref-list > ref')
    // TODO: determine order and label based on citations in the document
    return refs.map((ref) => {
      let refId = ref.getAttribute('rid')
      if (!ref.state) {
        ref.state = {}
      }
      if (!ref.state.entity) {
        ref.state.entity = entityDb.get(refId)
      }
      return ref
    })
  }

  _getBibliographyElement() {
    return this.editorSession.getDocument().find('ref-list')
  }

}