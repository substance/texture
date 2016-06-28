'use strict';

var PublisherPackage = require('../../packages/author/package');
var ExampleXMLStore = require('../ExampleXMLStore');
var path = require('path');

module.exports = {
  name: 'science-writer',
  configure: function(config) {
    // Base package with regular JATS support
    config.import(PublisherPackage);

    // Define XML Store
    config.setXMLStore(ExampleXMLStore);
    config.addStyle(path.join(__dirname, 'app.scss'));
  }
};
