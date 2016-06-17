'use strict';

var Body = require('./Body');
var BodyConverter = require('./BodyConverter');

module.exports = {
  name: 'body',
  configure: function(config) {
    config.addNode(Body);
    config.addConverter('jats', BodyConverter);
  }
};