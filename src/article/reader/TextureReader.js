import { Component } from 'substance'
import ArticleAPI from '../ArticleAPI'
import ArticleReader from './ArticleReader'

export default class TextureReader extends Component {

  constructor(...args) {
    super(...args)
    const archive = this.props.archive
    this.manuscriptSession = archive.getEditorSession('manuscript')
    this.pubMetaDbSession = archive.getEditorSession('pub-meta')
    this.configurator = this.manuscriptSession.getConfigurator()
    this.api = new ArticleAPI(
      this.manuscriptSession,
      this.pubMetaDbSession,
      this.configurator.getModelRegistry()
    )
  }

  getChildContext() {
    const configurator = this.configurator
    const pubMetaDbSession = this.pubMetaDbSession
    return {
      configurator,
      pubMetaDbSession,
      api: this.api,
      urlResolver: this.props.archive
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-texture-reader')
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
