'use strict';

var Ref = require('./Ref');
var RefComponent = require('./RefComponent');
var RefTarget = require('./RefTarget');
var RefConverter = require('./RefConverter');

module.exports = {
  name: 'ref',
  configure: function(config) {
    config.addNode(Ref);
    config.addComponent(Ref.type, RefComponent);
    config.addComponent(Ref.type+'-target', RefTarget);
    config.addConverter('jats', RefConverter);
    config.addStyle(__dirname, '_ref.scss');
  }
};