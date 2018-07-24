import AbstractCitationManager from './AbstractCitationManager'
import { getPos } from './nodeHelpers'

export default class FootnoteManager extends AbstractCitationManager {
  constructor (articleSession, labelGenerator) {
    super(articleSession, 'fn', labelGenerator)
    // compute initial labels
    this._updateLabels()
  }

  getBibliography () {
    return this._getReferences().sort((a, b) => {
      return getPos(a) - getPos(b)
    })
  }

  // interface for EditXrefTool
  getAvailableResources () {
    return this.getBibliography()
  }

  _getReferences () {
    return this.articleSession.getDocument().findAll('fn')
  }

  _getBibliographyElement () {
    return this.articleSession.getDocument().find('fn-group')
  }
}
