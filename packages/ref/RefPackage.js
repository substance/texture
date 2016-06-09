'use strict';

var Ref = require('./Ref');
var RefComponent = require('./RefComponent');
var RefJATSConverter = require('./RefJATSConverter');

module.exports = {
  name: 'ref',
  configure: function(config) {
    config.addNode(Ref);
    config.addComponent(Ref.static.name, RefComponent);
    config.addConverter('jats', RefJATSConverter);
  }
};