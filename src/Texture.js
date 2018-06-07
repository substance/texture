import { Component } from 'substance'
import EditorPackage from './editor/EditorPackage'
import TextureArticleAPI from './article/TextureArticleAPI'

// TODO: needs to be refactored to achieve a consistent structure.
// Currently TextureReader is a modified version of this implementation
// while editor/Editor.js is an AbstractWriter implementation.
export default class Texture extends Component {

  constructor(...args) {
    super(...args)
    const archive = this.props.archive
    
    this.manuscriptSession = archive.getEditorSession('manuscript')
    const doc = this.manuscriptSession.getDocument()
    this.pubMetaDbSession = archive.getEditorSession('pub-meta')
    this.configurator = this.manuscriptSession.getConfigurator()
    this.api = new TextureArticleAPI(
      this.manuscriptSession,
      this.pubMetaDbSession,
      this.configurator.getModelRegistry()
    )

    // HACK: we need to expose referenceManager somehow, so it can be used in
    // the JATSExporter. We may want to consider including referenceManager in
    // TODO: Exporters should use the API instead
    doc.referenceManager = this.api.getReferenceManager()
  }

  getChildContext() {
    // ATTENTION: in Stencila we had regressions, because TextureEditorPackage.Editor
    // is creating a different childContext which raises the chance for integration issues.
    // So try to keep this as minimal as possible and rather change
    // Editor.getChildContet() instead
    return {
      urlResolver: this.props.archive,
      api: this.api,
      configurator: this.getConfigurator(),
      pubMetaDbSession: this.pubMetaDbSession,
      referenceManager: this.api.getReferenceManager(),
      footnoteManager: this.api.getFootnoteManager(),
      figureManager: this.api.getFigureManager(),
      tableManager: this.api.getTableManager()
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-texture')
    el.append(
      $$(EditorPackage.Editor, {
        editorSession: this.manuscriptSession,
        pubMetaDbSession: this.pubMetaDbSession
      })
    )
    return el
  }

  getConfigurator() {
    return this.configurator
  }

}
