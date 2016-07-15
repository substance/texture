'use strict';

var TitleGroup = require('./TitleGroup');
var TitleGroupConverter = require('./TitleGroupConverter');
var TitleGroupComponent = require('./TitleGroupComponent');

module.exports = {
  name: 'title-group',
  configure: function(config) {
    config.addNode(TitleGroup);
    config.addConverter('jats', TitleGroupConverter);
    config.addComponent(TitleGroup.static.name, TitleGroupComponent);
  }
};
