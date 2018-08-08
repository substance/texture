import AbstractResourceManager from './AbstractResourceManager'

export default class TableManager extends AbstractResourceManager {
  constructor (doc, labelGenerator) {
    super(doc, 'table', labelGenerator)

    this._updateLabels()
  }
}
