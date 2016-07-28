'use strict';

var substanceGlobals = require('substance/util/substanceGlobals');
substanceGlobals.DEBUG_RENDERING = true;

var Texture = require('../../packages/texture/Texture');
var TextureConfigurator = require('../../packages/texture/TextureConfigurator');

var configurator = new TextureConfigurator().import(require('./package'));

window.onload = function() {
  window.app = Texture.mount({
    mode: 'publisher',
    documentId: 'elife-00007',
    configurator: configurator
  }, document.body);
};
