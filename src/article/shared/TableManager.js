import AbstractResourceManager from './AbstractResourceManager'

export default class TableManager extends AbstractResourceManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'table', labelGenerator)

    this._updateLabels()
  }
}
