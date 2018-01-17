import { Highlights, Toolbar, AbstractEditor } from 'substance'
import SaveHandler from './SaveHandler'
import { getXrefTargets } from './xrefHelpers'

class AbstractWriter extends AbstractEditor {

  constructor(...args) {
    super(...args)

    this.handleActions({
      'tocEntrySelected': this.tocEntrySelected
    })
  }

  _initialize(...args) {
    // TODO: re-factor AbstractEditor w.r.t. to how managers and such are maintained.
    // ATM many of these are owned by the EditorSession, which we want to change.
    // Instead EditorSession should really only be about document and selections, and changes.
    // Other managers such as SurfaceManager could be independent.
    // The main goal would be to pull state and flow onto application level.
    // For legacy and maybe other reasons, EditorSession could be still used as a proxy for the application flow.
    super._initialize(...args)

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
    childContext.labelGenerator = this.labelGenerator
    return childContext
  }

  _renderToolbar($$) {
    let configurator = this.getConfigurator()
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Toolbar, {
        toolPanel: configurator.getToolPanel('toolbar')
      }).ref('toolbar')
    )
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
      let targets = getXrefTargets(xref)
      highlights[xref.referenceType] = targets.concat([xref.id])
    }
    this.contentHighlights.set(highlights)
  }
}

export default AbstractWriter
