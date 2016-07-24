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
    config.addComponent(XRef.type, XRefComponent);
    config.addConverter('jats', XRefConverter);
    config.addCommand(XRef.type, XRefCommand, {nodeType: XRef.type});
    config.addTool(XRef.type, XRefTool, { overlay: true });
    config.addStyle(__dirname, '_xref.scss');
    config.addLabel(XRef.type, {
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