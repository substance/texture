import { ProseEditor, Highlights } from 'substance'
import SaveHandler from './SaveHandler'

// TODO: we need to think if it is really a good idea to
// derive from ProseEditor here
// There would be a lot of code redundancy
class AbstractWriter extends ProseEditor {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'tocEntrySelected': this.tocEntrySelected
    })
  }

  _initialize() {
    super._initialize.apply(this, arguments);

    this.exporter = this._getExporter()
    this.tocProvider = this._getTOCProvider()
    this.saveHandler = this._getSaveHandler()
    this.documentSession.setSaveHandler(this.saveHandler)

    let doc = this.props.documentSession.getDocument()
    this.contentHighlights = new Highlights(doc)
  }

  getChildContext() {
    let childContext = super.getChildContext.apply(this, arguments)
    childContext.tocProvider = this.tocProvider
    return childContext
  }

  _renderToolbar($$) { // eslint-disable-line
    return super._renderToolbar.apply(this, arguments)
  }

  _renderContentPanel($$) { // eslint-disable-line
    throw new Error("This method is abstract.")
  }

  tocEntrySelected(nodeId) {
    return this._scrollTo(nodeId)
  }

  _scrollTo(nodeId) { // eslint-disable-line
    throw new Error("This method is abstract.")
  }

  _getExporter() {
    throw new Error("This method is abstract.")
  }

  _getTOCProvider() {
    throw new Error("This method is abstract.")
  }

  _getSaveHandler() {
    return new SaveHandler({
      documentId: this.props.documentId,
      xmlStore: this.context.xmlStore,
      exporter: this.exporter
    })
  }

  /*
    TODO: this should live in the xref package with the ability
    for other packages to manage their own highlights.
  */
  documentSessionUpdated() {
    super.documentSessionUpdated()
    let documentSession = this.documentSession
    let sel = documentSession.getSelection()
    let selectionState = documentSession.getSelectionState()

    let xrefs = selectionState.getAnnotationsForType('xref')
    let highlights = {
      'fig': [],
      'bibr': []
    }

    if (xrefs.length === 1 && xrefs[0].getSelection().equals(sel) ) {
      let xref = xrefs[0]
      // highlights.xref = [ xref.id ]
      highlights[xref.referenceType] = xref.targets.concat([xref.id])
    }

    this.contentHighlights.set(highlights)
  }

}

export default AbstractWriter
