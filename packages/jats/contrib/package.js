'use strict';

var Contrib = require('./Contrib');
var ContribComponent = require('./ContribComponent');
var ContribConverter = require('./ContribConverter');

module.exports = {
  name: 'contrib',
  configure: function(config) {
    config.addNode(Contrib);
    config.addComponent(Contrib.static.name, ContribComponent);
    config.addConverter('jats', ContribConverter);
    config.addStyle(__dirname, '_contrib.scss');
  }
};