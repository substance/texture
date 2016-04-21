'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function JATSNode() {
  JATSNode.super.apply(this, arguments);
}

DocumentNode.extend(JATSNode);

JATSNode.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
});

module.exports = JATSNode;