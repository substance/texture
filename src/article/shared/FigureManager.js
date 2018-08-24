import CitableContentManager from './CitableContentManager'

export default class FigureManager extends CitableContentManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'fig', labelGenerator)
    this._updateLabels()
  }
}
