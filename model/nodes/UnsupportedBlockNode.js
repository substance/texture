'use strict';

var BlockNode = require('substance/model/BlockNode');

function UnsupportedBlockNode() {
  UnsupportedBlockNode.super.apply(this, arguments);
}

BlockNode.extend(UnsupportedBlockNode);

UnsupportedBlockNode.static.name = "unsupported-block";

UnsupportedBlockNode.static.defineSchema({
  xml: 'string'
});



module.exports = UnsupportedBlockNode;
