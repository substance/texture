import CitableContentManager from './CitableContentManager'
import { BlockFormula } from '../nodes'

export default class EquationManager extends CitableContentManager {
  constructor (editorSession, labelGenerator) {
    super(editorSession, BlockFormula.refType, [BlockFormula.type], labelGenerator)
    this._updateLabels('initial')
  }

  static create (context) {
    const { editorSession, config } = context
    return new EquationManager(editorSession, config.getValue('equation-label-generator'))
  }
}
