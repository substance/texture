import AbstractResourceManager from './AbstractResourceManager'

export default class FigureManager extends AbstractResourceManager {
  constructor (doc, labelGenerator) {
    super(doc, 'fig', labelGenerator)
    this._updateLabels()
  }
}
