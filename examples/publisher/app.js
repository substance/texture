import { substanceGlobals } from 'substance'
import Package from './package'
import Texture from '../../packages/texture/Texture'
import TextureConfigurator from '../../packages/texture/TextureConfigurator'

substanceGlobals.DEBUG_RENDERING = true;
var configurator = new TextureConfigurator().import(Package);

window.onload = function() {
  window.app = Texture.mount({
    mode: 'publisher',
    documentId: 'elife-00007',
    configurator: configurator
  }, document.body);
};
