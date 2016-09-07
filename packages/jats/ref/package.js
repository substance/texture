'use strict';

var Ref = require('./Ref');
var RefComponent = require('./RefComponent');
var RefTarget = require('./RefTarget');
var RefConverter = require('./RefConverter');
var TagRefCommand = require('./TagRefCommand');
var TagRefTool = require('./TagRefTool');

module.exports = {
  name: 'ref',
  configure: function(config) {
    config.addNode(Ref);
    config.addComponent(Ref.type, RefComponent);
    config.addComponent(Ref.type+'-target', RefTarget);
    config.addConverter('jats', RefConverter);
    config.addCommand('tag-ref', TagRefCommand);
    config.addTool('tag-ref', TagRefTool);
    config.addIcon('tag-ref', { 'fontawesome': 'fa-bullseye' });
  }
};