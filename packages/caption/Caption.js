'use strict';

// TODO: we should be able to inherit from JATSNode to share properties.
var TextBlock = require('substance/model/TextBlock');

function Caption() {
  Caption.super.apply(this, arguments);
}

TextBlock.extend(Caption);

Caption.static.name = 'caption';

/*
  Content
    ( title?, (p)* )
*/
Caption.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  title: { type: 'text' },
  contentNodes: { type: ['id'], default: [] },
});

module.exports = Caption;