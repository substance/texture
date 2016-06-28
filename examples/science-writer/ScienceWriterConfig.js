'use strict';

var PublisherPackage = require('../../packages/author/package');
var ExampleXMLStore = require('../ExampleXMLStore');

module.exports = {
  name: 'science-writer',
  configure: function(config) {
    // Base package with regular JATS support
    config.import(PublisherPackage);

    // Define XML Store
    config.setXMLStore(ExampleXMLStore);
  }
};
