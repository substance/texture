import { Highlights, Toolbar, AbstractEditor } from 'substance'
import SaveHandler from './SaveHandler'

class AbstractWriter extends AbstractEditor {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'tocEntrySelected': this.tocEntrySelected
    })
  }

  _initialize() {
    super._initialize.apply(this, arguments);

    let editorSession = this.getEditorSession()
    let doc = editorSession.getDocument()

    this.exporter = this._getExporter()
    this.tocProvider = this._getTOCProvider()
    this.saveHandler = this._getSaveHandler()
    this.contentHighlights = new Highlights(doc)

    editorSession.setSaveHandler(this.saveHandler)
  }

  didMount() {
    super.didMount()

    this.getEditorSession().onUpdate(this._onSessionUpdate, this)
  }

  dispose() {
    super.dispose()
    this.getEditorSession().off(this)
  }

  getChildContext() {
    let childContext = super.getChildContext.apply(this, arguments)
    childContext.tocProvider = this.tocProvider
    return childContext
  }

  _renderToolbar($$) {
    let commandStates = this.commandManager.getCommandStates()
    return $$(Toolbar, {
      // TODO: How can we make this extensible (e.g. the tag group should be
      // activated by the TaggingPackage)
      toolGroups: ['text', 'document', 'annotations', 'default', 'insert', 'tag'],
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

  _onSessionUpdate(editorSession) {
    if (!editorSession.hasChanged('document') && !editorSession.hasChanged('selection')) return

    let sel = editorSession.getSelection()
    let selectionState = editorSession.getSelectionState()
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
