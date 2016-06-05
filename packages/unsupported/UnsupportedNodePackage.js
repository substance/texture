'use strict';

var UnsupportedNode = require('./UnsupportedNode');
var UnsupportedNodeComponent = require('./UnsupportedNodeComponent');
var UnsupportedNodeJATSConverter = require('./UnsupportedNodeJATSConverter');
var UnsupportedNodeCommand = require('./UnsupportedNodeCommand');
var UnsupportedNodeTool = require('./UnsupportedNodeTool');

module.exports = {
  name: 'unsupported',
  configure: function(config) {
    config.addNode(UnsupportedNode);
    config.addComponent(UnsupportedNode.static.name, UnsupportedNodeComponent);
    config.addCommand(UnsupportedNodeCommand);
    config.addTool(UnsupportedNodeTool, { overlay: true });
    config.addConverter('jats', UnsupportedNodeJATSConverter);
  }
};