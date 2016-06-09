'use strict';

var CrossReference = require('./CrossReference');
var CrossReferenceComponent = require('./CrossReferenceComponent');
var CrossReferenceJATSConverter = require('./CrossReferenceJATSConverter');
var CrossReferenceCommand = require('./CrossReferenceCommand');
var CrossReferenceTool = require('./CrossReferenceTool');

module.exports = {
  name: 'cross-reference',
  configure: function(config) {
    config.addNode(CrossReference);
    config.addComponent(CrossReference.static.name, CrossReferenceComponent);
    config.addConverter('jats', CrossReferenceJATSConverter);
    config.addCommand(CrossReferenceCommand);
    config.addTool(CrossReferenceTool, { overlay: true });
  }
};