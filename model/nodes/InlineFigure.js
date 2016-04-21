'use strict';

// TODO: we should be able to inherit from JATSNode to share properties.

var InlineNode = require('substance/model/InlineNode');

function InlineFigure() {
  Figure.super.apply(this, arguments);
}

InlineNode.extend(InlineFigure);

InlineFigure.static.name = "inline-figure";
InlineFigure.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  objectIdNodes: { type: ['id'], default: [] },
  label: { type: 'text', optional: true },
  captionNodes: { type: ['id'], default: [] },
  abstractNodes: { type: ['id'], default: [] },
  kwdGroupNodes: { type: ['id'], default: [] },
  contentNodes: { type: ['id'], default: [] },
  attribNodes: { type: ['id'], default: [] },
});

module.exports = InlineFigure;