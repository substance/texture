'use strict';

var Paragraph = require('substance/packages/paragraph/ParagraphPackage');
var ParagraphJATSConverter = require('./ParagraphJATSConverter');

module.exports = {
  name: 'paragraph',
  configure: function(config) {
    config.import(Paragraph);
    config.addConverter('jats', ParagraphJATSConverter);
  }
};