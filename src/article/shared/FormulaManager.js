import CitableContentManager from './CitableContentManager'
import { BlockFormula } from '../nodes'

export default class FormulaManager extends CitableContentManager {
  constructor (editorSession, labelGenerator) {
    super(editorSession, BlockFormula.refType, [BlockFormula.type], labelGenerator)
    this._updateLabels('initial')
  }
}
