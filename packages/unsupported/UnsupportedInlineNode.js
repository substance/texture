'use strict';

var InlineNode = require('substance/model/InlineNode');

function UnsupportedInlineNode() {
  UnsupportedInlineNode.super.apply(this, arguments);
}

InlineNode.extend(UnsupportedInlineNode);

UnsupportedInlineNode.static.name = 'unsupported-inline';

UnsupportedInlineNode.static.defineSchema({
  xml: 'string',
  tagName: 'string'
});

module.exports = UnsupportedInlineNode;
