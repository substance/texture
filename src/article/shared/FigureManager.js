import AbstractResourceManager from './AbstractResourceManager'

export default class FigureManager extends AbstractResourceManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'fig', labelGenerator)
    this._updateLabels()
  }
}
