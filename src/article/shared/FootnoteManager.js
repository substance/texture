import AbstractCitationManager from './AbstractCitationManager'
import { getPos } from './nodeHelpers'

export default class FootnoteManager extends AbstractCitationManager {
  constructor (doc, labelGenerator) {
    super(doc, 'fn', labelGenerator)
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
    return this.doc.get('footnotes').children
  }

  _getBibliographyElement () {
    return this.doc.get('footnotes')
  }
}
