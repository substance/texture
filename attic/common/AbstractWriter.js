import { Highlights, Toolbar, AbstractEditor } from 'substance'
import SaveHandler from './SaveHandler'
import NumberedLabelGenerator from './NumberedLabelGenerator'

class AbstractWriter extends AbstractEditor {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'tocEntrySelected': this.tocEntrySelected
    })
  }

  _initialize() {
    super._initialize.apply(this, arguments)

    let editorSession = this.getEditorSession()
    let doc = editorSession.getDocument()

    this.exporter = this._getExporter()
    this.tocProvider = this._getTOCProvider()
    this.saveHandler = this._getSaveHandler()
    this.contentHighlights = new Highlights(doc)

    let sortNumeric = function(a, b){ return a-b }
    // NOTE: Supported ref-types are hard-coded for now
    this.labelGenerator = new NumberedLabelGenerator(editorSession, this.exporter, {
      'bibr': function(targets) {
        let positions = targets.map(t => t.position).sort(sortNumeric)
        return '[' + (positions.join(',') || '???') + ']'
      },
      'fig': function(targets) {
        let positions = targets.map(t => t.position).sort(sortNumeric)
        return 'Figure ' + (positions.join(',') || '???')
      },
      'table': function(targets) {
        let positions = targets.map(t => t.position).sort(sortNumeric)
        return 'Table ' + (positions.join(',') || '???')
      },
      // E.g. eLife videos are refernced as other
      'other': function(targets) {
        let positions = targets.map(t => t.position).sort(sortNumeric)
        return 'Other ' + (positions.join(',') || '???')
      }
    })
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
    let commandStates = this.commandManager.getCommandStates()
    return $$(Toolbar, {
      toolPanel: configurator.getToolPanel('toolbar')
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
