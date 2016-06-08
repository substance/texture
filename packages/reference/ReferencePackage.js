'use strict';

var Reference = require('./Reference');
var ReferenceComponent = require('./ReferenceComponent');
var ReferenceJATSConverter = require('./ReferenceJATSConverter');
var ReferenceCommand = require('./ReferenceCommand');
var EditReferenceTool = require('./EditReferenceTool');

module.exports = {
  name: 'graphic',
  configure: function(config) {
    config.addNode(Reference);
    config.addComponent(Reference.static.name, ReferenceComponent);
    config.addConverter('jats', ReferenceJATSConverter);
    config.addCommand(ReferenceCommand);
    config.addTool(EditReferenceTool, { overlay: true });
  }
};