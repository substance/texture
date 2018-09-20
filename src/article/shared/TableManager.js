import CitableContentManager from './CitableContentManager'

export default class TableManager extends CitableContentManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'table', labelGenerator)

    this._updateLabels('initial')
  }
}
