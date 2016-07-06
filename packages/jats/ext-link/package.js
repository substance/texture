'use strict';

var ExtLink = require('./ExtLink');
var ExtLinkConverter = require('./ExtLinkConverter');
var ExtLinkComponent = require('./ExtLinkComponent');
var ExtLinkTool = require('./ExtLinkTool');
var ExtLinkCommand = require('./ExtLinkCommand');
var EditExtLinkTool = require('./EditExtLinkTool');


module.exports = {
  name: 'ext-link',
  configure: function(config) {
    config.addNode(ExtLink);
    config.addConverter('jats', ExtLinkConverter);
    config.addComponent(ExtLink.static.name, ExtLinkComponent);

    config.addCommand(ExtLinkCommand);
    config.addTool(ExtLinkTool);
    config.addTool(EditExtLinkTool, { overlay: true });
    config.addIcon(ExtLinkCommand.static.name, { 'fontawesome': 'fa-link'});
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' });
    config.addLabel('ext-link', {
      en: 'Link'
    });
    config.addStyle(__dirname, '_ext-link.scss');
  }
};