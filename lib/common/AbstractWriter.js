import { Highlights, Toolbar, AbstractEditor } from 'substance'
import SaveHandler from './SaveHandler'

// TODO: we need to think if it is really a good idea to
// derive from ProseEditor here
// There would be a lot of code redundancy
class AbstractWriter extends AbstractEditor {
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

  _renderToolbar($$) {
    let commandStates = this.commandManager.getCommandStates()
    return $$(Toolbar, {
      commandStates: commandStates
    }).ref('toolbar')
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


  documentSessionUpdated() {
    let toolbar = this.refs.toolbar
    if (toolbar) {
      let commandStates = this.commandManager.getCommandStates()
      toolbar.setProps({
        commandStates: commandStates
      })
    }

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
      highlights[xref.referenceType] = xref.targets.concat([xref.id])
    }

    this.contentHighlights.set(highlights)
  }

}

export default AbstractWriter
