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
    config.addComponent(UnsupportedNode.type, UnsupportedNodeComponent);
    config.addComponent(UnsupportedInlineNode.type, UnsupportedInlineNodeComponent);
    config.addCommand(UnsupportedInlineNode.type, UnsupportedInlineNodeCommand, {nodeType: UnsupportedInlineNode.type});
    config.addTool(UnsupportedInlineNode.type, UnsupportedInlineNodeTool, { overlay: true });
    config.addConverter('jats', UnsupportedNodeJATSConverter);
    config.addConverter('jats', UnsupportedInlineNodeJATSConverter);
  }
};
