import { substanceGlobals } from 'substance'
import Texture from '../../lib/texture/Texture'
import TextureConfigurator from '../../lib/texture/TextureConfigurator'
import AuthorPackage from '../../lib/author/AuthorPackage'
import ExampleXMLStore from '../ExampleXMLStore'

substanceGlobals.DEBUG_RENDERING = true;

/* Example Configuration */
let configurator = new TextureConfigurator()
  .import(AuthorPackage)
  .setXMLStore(ExampleXMLStore)

if (typeof window !== 'undefined') {
  window.onload = function() {
    let app = Texture.mount({
      configurator: configurator,
      documentId: 'elife-15278'
    }, document.body)
    window.app = app
  }
}

