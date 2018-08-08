// import updateEntityChildArray from '../shared/updateEntityChildArray'
import AbstractCitationManager from './AbstractCitationManager'

export default class ReferenceManager extends AbstractCitationManager {
  constructor (doc, labelGenerator) {
    super(doc, 'bibr', labelGenerator)
    // compute initial labels
    this._updateLabels()
  }

  // TODO: don't do this here, instead add something like this to ArticleAPI
  updateReferences (newRefs) { // eslint-disable-line no-unused-vars
    console.error('FIXME: do not update references here, use the ArticleAPI instead')
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography () {
    let references = this._getReferences()
    // ATTENTION: state.pos is computed by AbstractCitationManager
    references.sort((a, b) => {
      return a.state.pos - b.state.pos
    })
    return references
  }

  getAvailableResources () {
    return this.getBibliography()
  }

  _getReferences () {
    const doc = this.doc
    let refs = doc.get('references').getChildren()
    refs.forEach(ref => {
      if (!ref.state) ref.state = { pos: Number.MAX_VALUE }
    })
    return refs
  }
}
