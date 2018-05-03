import {
  Component, Configurator, EditorSession, AbstractEditor, TextPropertyEditor
} from 'substance'
import RichTextInputPackage from './RichTextInputPackage'

export default class RichTextInput extends Component {
  constructor(...args) {
    super(...args)
    this.cfg = new Configurator().import(RichTextInputPackage)
    this._initDoc(this.props)
  }

  _initDoc(props) {
    this.importer = this.cfg.createImporter('html')
    this.doc = this.importer.importDocument(props.value)
    this.editorSession = new EditorSession(this.doc, {
      id: this.props.editorId,
      configurator: this.cfg
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-rich-text-input')
    el.append(
      $$(RichTextEditor, {
        editorSession: this.editorSession,
        editorId: this.props.editorId
      }).ref('editor')
    )
    return el
  }

  getValue() {
    let htmlExporter = this.cfg.createExporter('html')
    let result = htmlExporter.exportDocument(this.doc)
    return result
  }
}


class RichTextEditor extends AbstractEditor {
  render($$) {
    let el = $$('div').addClass('sc-richtext-editor')
    let BodyScrollPane = this.getComponent('body-scroll-pane')
    let Overlay = this.getComponent('overlay')
    let configurator = this.getConfigurator()

    // TODO: there must be a more elegant solution than wrapping every
    // RichtTextEditor widget into a fake BodyScrollPane
    el.append(
      $$(BodyScrollPane).append(
        $$(TextPropertyEditor, {
          path: ['body', 'content']
        }).ref('body'),
        $$(Overlay, {
          toolPanel: configurator.getToolPanel('main-overlay'),
          theme: 'dark'
        })
      )
    )
    return el
  }
}
