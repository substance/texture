'use strict';

var Superscript = require('./Superscript');
var SuperscriptConverter = require('./SuperscriptConverter');

module.exports = {
  name: 'superscript',
  configure: function(config) {
    config.addNode(Superscript);
    config.addConverter('jats', SuperscriptConverter);
    config.addStyle(__dirname, '_superscript.scss');
  }
};
