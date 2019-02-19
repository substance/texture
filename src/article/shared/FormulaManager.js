import CitableContentManager from './CitableContentManager'
import { BlockFormula } from '../models'

export default class FormulaManager extends CitableContentManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, BlockFormula.refType, [BlockFormula.type], labelGenerator)
    this._updateLabels('initial')
  }
}
