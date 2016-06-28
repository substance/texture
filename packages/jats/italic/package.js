'use strict';

var Italic = require('./Italic');
var ItalicConverter = require('./ItalicConverter');

module.exports = {
  name: 'italic',
  configure: function(config) {
    config.addNode(Italic);
    config.addConverter('jats', ItalicConverter);
  }
};
