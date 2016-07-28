'use strict';

var TexturePackage = require('../../packages/texture/package');
var ExampleXMLStore = require('../ExampleXMLStore');

module.exports = {
  name: 'publisher-example',
  configure: function(config) {
    config.import(TexturePackage);

    // Define XML Store
    config.setXMLStore(ExampleXMLStore);
    config.addStyle(__dirname, 'app.scss');
  }
};
