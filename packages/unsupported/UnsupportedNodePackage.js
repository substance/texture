'use strict';

var UnsupportedNode = require('./UnsupportedNode');
var UnsupportedInlineNode = require('./UnsupportedInlineNode');
var UnsupportedNodeComponent = require('./UnsupportedNodeComponent');
var UnsupportedInlineNodeComponent = require('./UnsupportedInlineNodeComponent');
var UnsupportedNodeJATSConverter = require('./UnsupportedNodeJATSConverter');
var UnsupportedInlineNodeJATSConverter = require('./UnsupportedInlineNodeJATSConverter');
var UnsupportedInlineNodeCommand = require('./UnsupportedInlineNodeCommand');
var UnsupportedInlineNodeTool = require('./UnsupportedInlineNodeTool');

module.exports = {
  name: 'unsupported',
  configure: function(config) {
    config.addNode(UnsupportedNode);
    config.addNode(UnsupportedInlineNode);
    config.addComponent(UnsupportedNode.static.name, UnsupportedNodeComponent);
    config.addComponent(UnsupportedInlineNode.static.name, UnsupportedInlineNodeComponent);
    config.addCommand(UnsupportedInlineNodeCommand);
    config.addTool(UnsupportedInlineNodeTool, { overlay: true });
    config.addConverter('jats', UnsupportedNodeJATSConverter);
    config.addConverter('jats', UnsupportedInlineNodeJATSConverter);
  }
};