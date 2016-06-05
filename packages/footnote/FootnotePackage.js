'use strict';

var Footnote = require('./Footnote');
var FootnoteComponent = require('./FootnoteComponent');
var FootnoteJATSConverter = require('./FootnoteJATSConverter');

module.exports = {
  name: 'footnote',
  configure: function(config) {
    config.addNode(Footnote);
    config.addComponent(Footnote.static.name, FootnoteComponent);
    config.addConverter('jats', FootnoteJATSConverter);
  }
};