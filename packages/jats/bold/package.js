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
    config.addCommand(BoldCommand);
    config.addTool(BoldTool);
    config.addIcon(BoldCommand.static.name, { 'fontawesome': 'fa-bold' });
    config.addStyle(__dirname, '_bold.scss');
    config.addLabel('bold', {
      en: 'Bold'
    });
  }
};
