import AbstractCitationManager from './AbstractCitationManager'
import { getPos } from './nodeHelpers'

export default class FootnoteManager extends AbstractCitationManager {

  constructor(context) {
    super(context.editorSession, 'fn', context.configurator.getLabelGenerator('footnotes'))

    // compute initial labels
    this._updateLabels()
  }

  getBibliography() {
    return this._getReferences().sort((a,b) => {
      return getPos(a) - getPos(b)
    })
  }

  // interface for EditXrefTool
  getAvailableResources() {
    return this.getBibliography()
  }

  _getReferences() {
    return this.editorSession.getDocument().findAll('fn')
  }

  _getBibliographyElement() {
    return this.editorSession.getDocument().find('fn-group')
  }

}