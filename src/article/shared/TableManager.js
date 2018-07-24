import AbstractResourceManager from './AbstractResourceManager'

export default class TableManager extends AbstractResourceManager {
  constructor (articleSession, labelGenerator) {
    super(articleSession, 'table', labelGenerator)

    this._updateLabels()
  }
}
