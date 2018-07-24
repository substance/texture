import AbstractResourceManager from './AbstractResourceManager'

export default class FigureManager extends AbstractResourceManager {
  constructor (articleSession, labelGenerator) {
    super(articleSession, 'fig', labelGenerator)
    this._updateLabels()
  }
}
