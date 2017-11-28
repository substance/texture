import {
  Component, Configurator, EditorSession
} from 'substance'
import RichtextEditor from './RichtextEditor'
import RichtextInputPackage from './RichtextInputPackage'


class RichTextInput extends Component {
  constructor(...args) {
    super(...args)
    this.cfg = new Configurator().import(RichtextInputPackage)
    this._initDoc(this.props)
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
      $$(RichtextEditor, {
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
