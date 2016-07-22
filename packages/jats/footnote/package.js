'use strict';

var Footnote = require('./Footnote');
var FootnoteComponent = require('./FootnoteComponent');
var FootnoteConverter = require('./FootnoteConverter');

module.exports = {
  name: 'footnote',
  configure: function(config) {
    config.addNode(Footnote);
    config.addComponent(Footnote.type, FootnoteComponent);
    config.addConverter('jats', FootnoteConverter);
    config.addStyle(__dirname, '_footnote.scss');
  }
};