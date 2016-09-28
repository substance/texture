import { substanceGlobals } from 'substance'
import Package from './package'
import Texture from '../../packages/texture/Texture'
import TextureConfigurator from '../../packages/texture/TextureConfigurator'
import Publisher from '../../packages/publisher/Publisher'

substanceGlobals.DEBUG_RENDERING = true;

class App extends Texture {

  render($$) {
    let el = $$('div').addClass('sc-publisher-example')

    if (this.state.error) {
      el.append(this.state.error)
    }

    if (this.state.documentSession) {
      el.append($$(Publisher, {
        documentId: this.props.documentId,
        documentSession: this.state.documentSession,
        configurator: this.getConfigurator()
      }))
    }

    return el
  }
}

App.Configurator = TextureConfigurator

if (typeof window !== 'undefined') {
  window.onload = function() {
    let configurator = new TextureConfigurator()
    configurator.import(Package)
    var app = App.mount({
      configurator: configurator,
      documentId: 'elife-15278'
    }, document.body)
    window.app = app
  };
}

export default App
