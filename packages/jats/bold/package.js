'use strict';

var Bold = require('./Bold');
var BoldConverter = require('./BoldConverter');
var AnnotationTool = require('substance/ui/AnnotationTool');
var AnnotationCommand = require('substance/ui/AnnotationCommand');


module.exports = {
  name: 'bold',
  configure: function(config) {
    config.addNode(Bold);
    config.addConverter('jats', BoldConverter);
    config.addCommand(Bold.type, AnnotationCommand, { nodeType: Bold.type });
    config.addTool(Bold.type, AnnotationTool);
    config.addIcon(Bold.type, { 'fontawesome': 'fa-bold' });
    config.addStyle(__dirname, '_bold.scss');
    config.addLabel(Bold.type, {
      en: 'Bold'
    });
  }
};
