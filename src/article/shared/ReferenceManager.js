import AbstractCitationManager from './AbstractCitationManager'
import NumberedLabelGenerator from './NumberedLabelGenerator'

export default class ReferenceManager extends AbstractCitationManager {
  constructor (documentSession, config) {
    super(documentSession, 'bibr', ['ref'], new NumberedLabelGenerator(config))
    // compute initial labels
    this._updateLabels('initial')
  }

  getBibliography () {
    return this.getSortedCitables()
  }

  _getCollectionElement () {
    return this._getDocument().get('references')
  }
}
