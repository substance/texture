import { Component } from 'substance'
import ArticleReader from './ArticleReader'

export default class Texture extends Component {

  constructor(...args) {
    super(...args)
    const archive = this.props.archive
    this.manuscriptSession = archive.getEditorSession('manuscript')
    this.pubMetaDbSession = archive.getEditorSession('pub-meta')
    this.configurator = this.manuscriptSession.getConfigurator()
  }

  getChildContext() {
    const configurator = this.configurator
    const pubMetaDbSession = this.pubMetaDbSession
    return {
      configurator,
      pubMetaDbSession,
      urlResolver: this.props.archive
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-texture')
    el.append(
      $$(ArticleReader, {
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
