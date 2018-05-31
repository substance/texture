import { Component } from 'substance'
import EditorPackage from './editor/EditorPackage'

export default class Texture extends Component {

  constructor(...args) {
    super(...args)
    const archive = this.props.archive
    this.manuscriptSession = archive.getEditorSession('manuscript')
    this.pubMetaDbSession = archive.getEditorSession('pub-meta')
    this.configurator = this.manuscriptSession.getConfigurator()
  }

  getChildContext() {
    // ATTENTION: in Stencila we had regressions, because TextureEditorPackage.Editor
    // is creating a different childContext which raises the chance for integration issues.
    // So try to keep this as minimal as possible and rather change
    // Editor.getChildContet() instead
    return {
      urlResolver: this.props.archive
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
