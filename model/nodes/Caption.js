'use strict';

// TODO: we should be able to inherit from JATSNode to share properties.
var TextBlock = require('substance/model/TextBlock');

function Caption() {
  Caption.super.apply(this, arguments);
}

TextBlock.extend(Caption);

Caption.static.name = 'caption';
Caption.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  title: { type: 'text', optional: true },
  contentNodes: { type: ['id'], default: [] },
});

module.exports = Caption;