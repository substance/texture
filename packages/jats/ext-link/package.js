'use strict';

var ExtLink = require('./ExtLink');
var ExtLinkConverter = require('./ExtLinkConverter');
var ExtLinkComponent = require('./ExtLinkComponent');
var AnnotationTool = require('substance/ui/AnnotationTool');
var ExtLinkCommand = require('./ExtLinkCommand');
var EditExtLinkTool = require('./EditExtLinkTool');

module.exports = {
  name: 'ext-link',
  configure: function(config) {
    config.addNode(ExtLink);
    config.addComponent(ExtLink.type, ExtLinkComponent);
    config.addConverter('jats', ExtLinkConverter);

    config.addCommand(ExtLink.type, ExtLinkCommand, { nodeType: ExtLink.type });
    config.addTool(ExtLink.type, AnnotationTool);
    config.addTool('edit-ext-link', EditExtLinkTool, { overlay: true });
    config.addIcon(ExtLink.type, { 'fontawesome': 'fa-link'});
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' });
    config.addLabel(ExtLink.type, {
      en: 'Link'
    });
    config.addStyle(__dirname, '_ext-link.scss');
  }
};