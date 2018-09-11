import { Component } from 'substance'
import TextureConfigurator from './TextureConfigurator'
import ArticlePackage from './article/ArticlePackage'

// TODO: this should incoporate the 'Project' stuff that we have in Stencila
export default class Texture extends Component {
  constructor (...args) {
    super(...args)

    this.config = this._getConfiguration()
  }

  render ($$) {
    const archive = this.props.archive
    let el = $$('div').addClass('sc-texture')

    // TODO: switch by current document tab
    const currentDocumentName = 'manuscript'
    const ResourceComponent = this.config.getComponent('article')
    const config = this.config.getConfiguration('article')
    const documentSession = archive.getEditorSession(currentDocumentName)
    let props = {
      archive,
      config,
      documentSession
    }
    el.append(
      $$(ResourceComponent, props).ref('resource')
    )
    return el
  }

  _getConfiguration () {
    let config = new TextureConfigurator()
    // TODO: in future we want to make this configurable (plugin framework)
    config.import(ArticlePackage)
    return config
  }

  _handleKeydown (event) {
    this.refs.resource._handleKeydown(event)
  }
}
