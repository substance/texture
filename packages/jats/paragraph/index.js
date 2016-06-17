'use strict';

var SubstanceParagraphPackage = require('substance/packages/paragraph/ParagraphPackage');
var ParagraphConverter = require('./ParagraphConverter');

module.exports = {
  name: 'paragraph',
  configure: function(config) {
    config.import(SubstanceParagraphPackage);
    config.addConverter('jats', ParagraphConverter);
  }
};
