import { substanceGlobals } from 'substance'
import Texture from '../../packages/texture/Texture'
import TextureConfigurator from '../../packages/texture/TextureConfigurator'
import AuthorPackage from '../../packages/author/AuthorPackage'
import TaggingPackage from '../../packages/tagging/TaggingPackage'
import ExampleXMLStore from '../ExampleXMLStore'

substanceGlobals.DEBUG_RENDERING = true

/* Configure example */
let configurator = new TextureConfigurator()
  .import(AuthorPackage)
  // enable tagging abilities
  .import(TaggingPackage)
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
