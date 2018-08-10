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

  getReferenceIds () {
    // FIXME
    return []
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography () {
    let references = this._getReferences()
    references.sort((a, b) => {
      return a.pos - b.pos
    })
    return references
  }

  getAvailableResources () {
    return this.getBibliography()
  }

  _getReferences () {
    // FIXME
    return []
  }
}
