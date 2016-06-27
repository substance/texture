'use strict';

var Back = require('./Back');
var BackConverter = require('./BackConverter');

module.exports = {
  name: 'back',
  configure: function(config) {
    config.addNode(Back);
    config.addConverter('jats', BackConverter);
  }
};