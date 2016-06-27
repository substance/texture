'use strict';

var Front = require('./Front');
var FrontConverter = require('./FrontConverter');

module.exports = {
  name: 'front',
  configure: function(config) {
    config.addNode(Front);
    config.addConverter('jats', FrontConverter);
  }
};