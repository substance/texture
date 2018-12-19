import CitableContentManager from './CitableContentManager'

export default class SupplementaryManager extends CitableContentManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'file', labelGenerator)
    this._updateLabels('initial')
  }
}
