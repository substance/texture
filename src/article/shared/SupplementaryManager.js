import CitableContentManager from './CitableContentManager'

export default class SupplementaryManager extends CitableContentManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'file', ['supplementary-file'], labelGenerator)
    this._updateLabels('initial')
  }
}
