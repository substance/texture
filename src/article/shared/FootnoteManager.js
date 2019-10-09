import { documentHelpers } from 'substance'
import AbstractCitationManager from './AbstractCitationManager'

export default class FootnoteManager extends AbstractCitationManager {
  constructor (editorSession, labelGenerator) {
    super(editorSession, 'fn', ['footnote'], labelGenerator)
    // compute initial labels
    this._updateLabels('initial')
  }

  static create (context) {
    const { editorSession, config } = context
    return new FootnoteManager(editorSession, config.getValue('footnote-label-generator'))
  }

  getCitables () {
    let doc = this._getDocument()
    return documentHelpers.getNodesForPath(doc, ['article', 'footnotes'])
  }
}
