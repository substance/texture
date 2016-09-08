import { substanceGlobals } from 'substance'
import Package from './package'
import TextureConfigurator from '../../packages/texture/TextureConfigurator'
import Texture from '../../packages/texture/Texture'

substanceGlobals.DEBUG_RENDERING = true;
var config = new TextureConfigurator().import(Package);

if (typeof window !== 'undefined') {
  window.onload = function() {
    window.app = Texture.mount({
      mode: 'author',
      documentId: 'kitchen-sink-author',
      configurator: config
    }, document.body);
  };
}

export default {
  config: config
}
