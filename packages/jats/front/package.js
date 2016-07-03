'use strict';

var Front = require('./Front');
var FrontConverter = require('./FrontConverter');
var FrontComponent = require('./FrontComponent');

module.exports = {
  name: 'front',
  configure: function(config) {
    config.addNode(Front);
    config.addConverter('jats', FrontConverter);
    config.addComponent(Front.static.name, FrontComponent);
  }
};