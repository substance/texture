'use strict';

var Reference = require('./Reference');
var ReferenceComponent = require('./ReferenceComponent');
var ReferenceJATSConverter = require('./ReferenceJATSConverter');

module.exports = {
  name: 'graphic',
  configure: function(config) {
    config.addNode(Reference);
    config.addComponent(Reference.static.name, ReferenceComponent);
    config.addConverter('jats', ReferenceJATSConverter);
  }
};