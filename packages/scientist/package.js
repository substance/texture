'use strict';

var AuthorPackage = require('../author/package');
var AuthorConfigurator = require('../author/AuthorConfigurator');
var PublisherPackage = require('../publisher/package');
var PublisherConfigurator = require('../publisher/PublisherConfigurator');

module.exports = {
  name: 'scientist',
  configure: function(config) {
    // Default configuration for available scientist modes
    config.addConfigurator('author', new AuthorConfigurator(AuthorPackage));
    config.addConfigurator('publisher', new PublisherConfigurator(PublisherPackage));
  }
};
