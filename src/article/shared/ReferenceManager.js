import updateEntityChildArray from '../shared/updateEntityChildArray'
import AbstractCitationManager from './AbstractCitationManager'

export default class ReferenceManager extends AbstractCitationManager {
  constructor (articleSession, labelGenerator) {
    super(articleSession, 'bibr', labelGenerator)
    // compute initial labels
    this._updateLabels()
  }

  // TODO: don't do this here, instead add something like this to ArticleAPI
  updateReferences (newRefs) {
    let refList = this.articleSession.getDocument().find('ref-list')
    let oldRefs = this.getReferenceIds()
    this.articleSession.transaction(tx => {
      updateEntityChildArray(tx, refList.id, 'ref', 'rid', oldRefs, newRefs)
    })
  }

  getReferenceIds () {
    let doc = this.articleSession.getDocument()
    let refs = doc.findAll('ref-list > ref')
    return refs.map(ref => ref.getAttribute('rid'))
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography () {
    let references = this._getReferences()
    references.sort((a, b) => {
      return a.state.pos - b.state.pos
    })
    return references
  }

  getAvailableResources () {
    return this.getBibliography()
  }

  _getReferences () {
    const doc = this.articleSession.getDocument()

    let refs = doc.findAll('ref-list > ref')
    // TODO: determine order and label based on citations in the document
    return refs.map((ref) => {
      let refId = ref.getAttribute('rid')
      if (!ref.state) {
        ref.state = {}
      }
      if (!ref.state.entity) {
        ref.state.entity = doc.get(refId)
      }
      return ref
    })
  }

  _getBibliographyElement () {
    return this.articleSession.getDocument().find('ref-list')
  }
}
