import { substanceGlobals } from 'substance'
import Texture from '../../packages/texture/Texture'
import TextureConfigurator from '../../packages/texture/TextureConfigurator'
import PublisherPackage from '../../packages/publisher/PublisherPackage'
import ExampleXMLStore from '../ExampleXMLStore'

substanceGlobals.DEBUG_RENDERING = true

/* Configure example */
let configurator = new TextureConfigurator()
  .import(PublisherPackage)
  .setXMLStore(ExampleXMLStore)

if (typeof window !== 'undefined') {
  window.onload = function() {
    var app = Texture.mount({
      configurator: configurator,
      documentId: 'elife-15278'
    }, document.body)
    window.app = app
  }
}

