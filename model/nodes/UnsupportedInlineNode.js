'use strict';

var Annotation = require('substance/model/PropertyAnnotation');

function UnsupportedInlineNode() {
  UnsupportedInlineNode.super.apply(this, arguments);
}

Annotation.extend(UnsupportedInlineNode);

UnsupportedInlineNode.static.name = "unsupported-inline";

UnsupportedInlineNode.static.defineSchema({
  xml: 'string'
});

module.exports = UnsupportedInlineNode;
