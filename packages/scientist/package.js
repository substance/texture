'use strict';

var ProseEditorConfigurator = require('substance/packages/prose-editor/ProseEditorConfigurator');

var AuthorPackage = require('../author/package');
var PublisherPackage = require('../publisher/package');

module.exports = {
  name: 'scientist',
  configure: function(config) {
    // Default configuration for available scientist modes
    config.addConfigurator('author', new ProseEditorConfigurator().import(AuthorPackage));
    config.addConfigurator('publisher', new ProseEditorConfigurator().import(PublisherPackage));
  }
};
