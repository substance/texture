'use strict';

// TODO: we should be able to inherit from JATSNode to share xmlAttributes properties.
var InlineNode = require('substance/model/InlineNode');

function InlineFootnote() {
  InlineFootnote.super.apply(this, arguments);
}

InlineNode.extend(InlineFootnote);

InlineFootnote.static.name = 'inline-footnote';
InlineFootnote.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  label: { type: 'text', optional: true },
  contentNodes: { type: ['id'], default: [] }
});

module.exports = InlineFootnote;