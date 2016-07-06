'use strict';

var XRef = require('./XRef');
var XRefComponent = require('./XRefComponent');
var XRefConverter = require('./XRefConverter');
var XRefCommand = require('./XRefCommand');
var XRefTool = require('./XRefTool');

module.exports = {
  name: 'xref',
  configure: function(config) {
    config.addNode(XRef);
    config.addComponent(XRef.static.name, XRefComponent);
    config.addConverter('jats', XRefConverter);
    config.addCommand(XRefCommand);
    config.addTool(XRefTool, { overlay: true });
    config.addStyle(__dirname, '_xref.scss');
    config.addLabel('xref', {
      en: 'Cross Reference'
    });
    config.addLabel('edit-xref', {
      en: 'Edit Reference'
    });
    config.addLabel('delete-xref', {
      en: 'Delete Reference'
    });
  }
};