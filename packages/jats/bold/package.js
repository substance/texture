'use strict';

var Bold = require('./Bold');
var BoldConverter = require('./BoldConverter');
var BoldTool = require('./BoldTool');
var BoldCommand = require('./BoldCommand');

module.exports = {
  name: 'bold',
  configure: function(config) {
    config.addNode(Bold);
    config.addConverter('jats', BoldConverter);
    config.addCommand(Bold.type, BoldCommand, { nodeType: Bold.type });
    config.addTool(Bold.type, BoldTool);
    config.addIcon(Bold.type, { 'fontawesome': 'fa-bold' });
    config.addLabel(Bold.type, {
      en: 'Bold'
    });
  }
};
