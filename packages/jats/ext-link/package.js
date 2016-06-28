'use strict';

var ExtLink = require('./ExtLink');
var ExtLinkConverter = require('./ExtLinkConverter');
var ExtLinkComponent = require('./ExtLinkComponent');

module.exports = {
  name: 'ext-link',
  configure: function(config) {
    config.addNode(ExtLink);
    config.addConverter('jats', ExtLinkConverter);
    config.addComponent(ExtLink.static.name, ExtLinkComponent);
    config.addStyle(__dirname, '_ext-link.scss');
  }
};