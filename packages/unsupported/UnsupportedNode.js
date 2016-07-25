'use strict';

var BlockNode = require('substance/model/BlockNode');

function UnsupportedNode() {
  UnsupportedNode.super.apply(this, arguments);
}

BlockNode.extend(UnsupportedNode);

UnsupportedNode.type = 'unsupported';

UnsupportedNode.define({
  attributes: { type: 'object', default: {} },
  xmlContent: {type: 'string', default: ''},
  tagName: 'string'
});

module.exports = UnsupportedNode;
