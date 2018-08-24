import AbstractCitationManager from './AbstractCitationManager'

export default class ReferenceManager extends AbstractCitationManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'bibr', labelGenerator)
    // compute initial labels
    this._updateLabels()
  }

  getBibliography () {
    return this.getSortedCitables()
  }

  _getCollectionElement () {
    return this._getDocument().get('references')
  }
}
