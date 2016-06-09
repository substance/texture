'use strict';

var InlineNode = require('substance/model/InlineNode');

function CrossReference() {
  CrossReference.super.apply(this, arguments);
}

InlineNode.extend(CrossReference);

CrossReference.static.name = 'cross-reference';

CrossReference.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  label: { type: 'text', optional: true },
  referenceType: { type: 'string'},
  target: {type: 'id'}
});

module.exports = CrossReference;