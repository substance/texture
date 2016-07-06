'use strict';

var Body = require('./Body');
var BodyConverter = require('./BodyConverter');
var BodyComponent = require('./BodyComponent');

module.exports = {
  name: 'body',
  configure: function(config) {
    config.addNode(Body);
    config.addConverter('jats', BodyConverter);
    config.addComponent(Body.static.name, BodyComponent);
  }
};