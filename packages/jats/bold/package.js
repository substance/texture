'use strict';

var Bold = require('./Bold');
var BoldConverter = require('./BoldConverter');

module.exports = {
  name: 'bold',
  configure: function(config) {
    config.addNode(Bold);
    config.addConverter('jats', BoldConverter);
    config.addStyle(__dirname, '_bold.scss');
  }
};
