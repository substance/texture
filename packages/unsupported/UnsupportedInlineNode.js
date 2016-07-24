'use strict';

var InlineNode = require('substance/model/InlineNode');

function UnsupportedInlineNode() {
  UnsupportedInlineNode.super.apply(this, arguments);
}

InlineNode.extend(UnsupportedInlineNode);

UnsupportedInlineNode.type = 'unsupported-inline';

UnsupportedInlineNode.define({
  xml: 'string',
  tagName: 'string'
});

module.exports = UnsupportedInlineNode;
