'use strict';

var TexturePackage = require('../../packages/texture/package');
var ExampleXMLStore = require('../ExampleXMLStore');

module.exports = {
  name: 'author-example',
  configure: function(config) {
    // Use the default Texture package
    config.import(TexturePackage);
    // Define XML Store
    config.setXMLStore(ExampleXMLStore);
  }
};
