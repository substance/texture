import CitableContentManager from './CitableContentManager'

export default class FormulaManager extends CitableContentManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'formula', ['disp-formula'], labelGenerator)
    this._updateLabels('initial')
  }
}
