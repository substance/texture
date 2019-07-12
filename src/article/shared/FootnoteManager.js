import { documentHelpers } from 'substance'
import AbstractCitationManager from './AbstractCitationManager'

export default class FootnoteManager extends AbstractCitationManager {
  constructor (editorSession, labelGenerator) {
    super(editorSession, 'fn', ['footnote'], labelGenerator)
    // compute initial labels
    this._updateLabels('initial')
  }

  getCitables () {
    let doc = this._getDocument()
    return documentHelpers.getNodesForPath(doc, ['article', 'footnotes'])
  }
}
