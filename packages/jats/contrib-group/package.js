'use strict';

var ContribGroup = require('./ContribGroup');
var ContribGroupConverter = require('./ContribGroupConverter');
var ContribGroupComponent = require('./ContribGroupComponent');

module.exports = {
  name: 'contrib-group',
  configure: function(config) {
    config.addNode(ContribGroup);
    config.addConverter('jats', ContribGroupConverter);
    config.addComponent(ContribGroup.static.name, ContribGroupComponent);
    config.addStyle(__dirname, '_contrib-group.scss');
  }
};
