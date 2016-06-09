'use strict';

var Back = require('./Back');
var BackJATSConverter = require('./BackJATSConverter');

module.exports = {
  name: 'back',
  configure: function(config) {
    config.addNode(Back);
    config.addConverter('jats', BackJATSConverter);
  }
};