import { Component } from 'substance'
import ArticlePanel from './article/ArticlePanel'

// TODO: this should incoporate the 'Project' stuff that we have in Stencila
export default class Texture extends Component {
  render ($$) {
    let el = $$('div').addClass('sc-texture')
    // TODO: use configurator (-> plugin framework)
    let ResourceComponent = ArticlePanel
    let props = this._getResourceProps()
    el.append(
      $$(ResourceComponent, props)
    )
    return el
  }

  _getResourceProps () {
    // TODO: derive props from archive and app-state, and use
    // a configurator (-> plugin framework)
    const archive = this.props.archive
    const articleSession = archive.getEditorSession('manuscript')
    const pubMetaDbSession = archive.getEditorSession('pub-meta')
    const config = articleSession.getConfigurator()
    return {
      articleSession,
      pubMetaDbSession,
      config
    }
  }
}
