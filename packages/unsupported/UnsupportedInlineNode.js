'use strict';

var InlineNode = require('substance/model/InlineNode');

function UnsupportedInlineNode() {
  UnsupportedInlineNode.super.apply(this, arguments);
}

InlineNode.extend(UnsupportedInlineNode);

UnsupportedInlineNode.type = 'unsupported-inline';

UnsupportedInlineNode.define({
  attributes: { type: 'object', default: {} },
  xmlContent: {type: 'string', default: ''},
  tagName: 'string'
});

module.exports = UnsupportedInlineNode;
