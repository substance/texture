import {
  Component, Configurator, EditorSession, SubscriptPackage,
  SuperscriptPackage, EmphasisPackage, StrongPackage
} from 'substance'
import RichTextInputEditor from './RichTextInputEditor'
import RichTextInputPackage from './RichTextInputPackage'


class RichTextInput extends Component {
  constructor(...args) {
    super(...args)
    this.cfg = new Configurator().import(RichTextInputPackage)
    let defaultOptions = {
      disableCollapsedCursor: true,
      toolGroup: 'annotations'
    }
    this.cfg.import(SubscriptPackage, defaultOptions)
    this.cfg.import(SuperscriptPackage, defaultOptions)
    this.cfg.import(EmphasisPackage, defaultOptions)
    this.cfg.import(StrongPackage, defaultOptions)

    this._initDoc(this.props)
  }

  didMount() {
    this.registerHandlers()
  }

  didUpdate() {
    this.registerHandlers()
  }

  hideOverlays() {
    this.refs.editor.hideOverlays()
  }

  registerHandlers() {
    this.editorSession.onRender('selection', this._onSelectionChanged, this)
  }

  unregisterHandlers() {
    this.editorSession.off(this)
  }

  dispose() {
    this.unregisterHandlers()
  }

  getChildContext() {
    return {
      editorId: this.props.editorId,
      scrollPane: this.props.scrollPane
    }
  }

  willReceiveProps(props) {
    this.dispose()
    this.empty()
    this._initDoc(props)
  }

  _initDoc(props) {
    this.importer = this.cfg.createImporter('html')
    this.doc = this.importer.importDocument(props.content)

    // Deregister handlers
    this.editorSession = new EditorSession(this.doc, {
      id: this.props.editorId,
      configurator: this.cfg
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-rich-text-input')
    el.append(
      $$(RichTextInputEditor, {
        editorSession: this.editorSession,
        editorId: this.props.editorId
      }).ref('editor')
    )
    return el
  }

  getHTML() {
    let htmlExporter = this.cfg.createExporter('html')
    return htmlExporter.exportDocument(this.doc)
  }
}

export default RichTextInput
