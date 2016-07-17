import ProseEditor from 'substance/packages/prose-editor/ProseEditor'
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

  _initialize(props) {
    super._initialize(props)

    this.exporter = this._getExporter()
    this.tocProvider = this._getTOCProvider()
    this.saveHandler = this._getSaveHandler()
    this.documentSession.setSaveHandler(this.saveHandler)
  }

  getChildContext() {
    var childContext = super.getChildContext()
    childContext.tocProvider = this.tocProvider
    return childContext
  }

  _renderToolbar($$) { // eslint-disable-line
    return super._renderToolbar($$)
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

}

export default AbstractWriter
