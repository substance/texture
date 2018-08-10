import AbstractCitationManager from './AbstractCitationManager'
import { getPos } from './nodeHelpers'

export default class FootnoteManager extends AbstractCitationManager {
  constructor (documentSession, labelGenerator) {
    super(documentSession, 'fn', labelGenerator)
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
    const doc = this._getDocument()
    return doc.get('footnotes').children
  }

  _getBibliographyElement () {
    const doc = this._getDocument()
    return doc.get('footnotes')
  }
}
