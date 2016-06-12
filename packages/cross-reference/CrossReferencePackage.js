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
    config.addLabel('cross-reference', {
      en: 'Cross Reference'
    });
    config.addLabel('edit-reference', {
      en: 'Edit Reference'
    });
    config.addLabel('delete-reference', {
      en: 'Delete Reference'
    });
  }
};