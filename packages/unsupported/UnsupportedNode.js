'use strict';

var BlockNode = require('substance/model/BlockNode');

function UnsupportedNode() {
  UnsupportedNode.super.apply(this, arguments);
}

BlockNode.extend(UnsupportedNode);

UnsupportedNode.static.name = 'unsupported';

UnsupportedNode.static.defineSchema({
  xml: 'string',
  tagName: 'string'
});

module.exports = UnsupportedNode;
