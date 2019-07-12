import { Component, platform } from 'substance'
import TextureConfigurator from './TextureConfigurator'
import ArticlePackage from './article/ArticlePackage'
import { PinnedMessage } from './kit/ui'

// TODO: this should incoporate the 'Project' stuff that we have in Stencila
export default class Texture extends Component {
  getInitialState () {
    return {
      currentDocumentName: 'manuscript'
    }
  }

  render ($$) {
    const config = this.props.config
    const archive = this.props.archive
    let el = $$('div').addClass('sc-texture')

    // TODO: switch by current document tab
    const currentDocumentName = this.state.currentDocumentName
    const ResourceComponent = config.getComponent('article')
    const articleConfig = config.getConfiguration('article')
    const document = archive.getDocument(currentDocumentName)
    let props = {
      archive,
      config: articleConfig,
      document
    }
    el.append(
      $$(ResourceComponent, props).ref('resource')
    )
    if (platform.inBrowser && !platform.isChromium && !platform.inElectron) {
      el.append(
        $$(PinnedMessage, { icon: 'fa-warning', label: 'Attention! Current version of Texture supports only Chrome browser.' })
      )
    }
    return el
  }

  static registerPlugin (plugin) {
    let plugins = Texture.plugins
    if (!plugins) {
      Texture.plugins = plugins = new Map()
    }
    let name = plugin.name
    if (plugins.has(name)) {
      throw new Error(`Plugin with name '${name}' has already been registered`)
    }
    plugins.set(name, plugin)
  }

  static getConfiguration () {
    let plugins = Texture.plugins
    let config = new TextureConfigurator()
    for (let plugin of plugins.values()) {
      // TODO: allow to disable plugins via a settings dialog
      plugin.configure(config)
    }
    return config
  }

  _handleKeydown (event) {
    this.refs.resource._handleKeydown(event)
  }
}

// register the core plugins here
Texture.registerPlugin(ArticlePackage)
