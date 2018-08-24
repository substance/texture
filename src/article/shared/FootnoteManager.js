import AbstractCitationManager from './AbstractCitationManager'

export default class FootnoteManager extends AbstractCitationManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'fn', labelGenerator)
    // compute initial labels
    this._updateLabels()
  }

  _getCollectionElement () {
    return this._getDocument().get('footnotes')
  }
}
