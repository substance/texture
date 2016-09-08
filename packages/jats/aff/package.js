'use strict';

var Aff = require('./Aff');
var AffComponent = require('./AffComponent');
var AffConverter = require('./AffConverter');
var TagAffCommand = require('./TagAffCommand');
var TagAffTool = require('./TagAffTool');

module.exports = {
  name: 'aff',
  configure: function(config) {
    config.addNode(Aff);
    config.addComponent(Aff.type, AffComponent);
    config.addConverter('jats', AffConverter);
    config.addCommand('tag-aff', TagAffCommand);
    config.addTool('tag-aff', TagAffTool);
    config.addIcon('tag-aff', { 'fontawesome': 'fa-bullseye' });
  }
};