'use strict';

var Contrib = require('./Contrib');
var ContribComponent = require('./ContribComponent');
var ContribConverter = require('./ContribConverter');
var TagContribCommand = require('./TagContribCommand');
var TagContribTool = require('./TagContribTool');

module.exports = {
  name: 'contrib',
  configure: function(config) {
    config.addNode(Contrib);
    config.addComponent(Contrib.type, ContribComponent);
    config.addConverter('jats', ContribConverter);
    config.addCommand('tag-contrib', TagContribCommand);
    config.addTool('tag-contrib', TagContribTool);
    config.addIcon('tag-contrib', { 'fontawesome': 'fa-bullseye' });
  }
};