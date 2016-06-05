'use strict';

var Front = require('./Front');
var FrontJATSConverter = require('./FrontJATSConverter');

module.exports = {
  name: 'front',
  configure: function(config) {
    config.addNode(Front);
    config.addConverter('jats', FrontJATSConverter);
  }
};