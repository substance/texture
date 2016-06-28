'use strict';

var PublisherPackage = require('../../packages/publisher/package');
var ExampleXMLStore = require('../ExampleXMLStore');
var path = require('path');

module.exports = {
  name: 'jats-editor',
  configure: function(config) {
    // Base package with regular JATS support
    config.import(PublisherPackage);

    // Define XML Store
    config.setXMLStore(ExampleXMLStore);
    config.addStyle(path.join(__dirname, 'app.scss'));
  }
};
