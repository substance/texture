'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Footnote() {
  Footnote.super.apply(this, arguments);
}

DocumentNode.extend(Footnote);

Footnote.static.name = 'footnote';

/*
  Content
    (label?, (p)+)
*/
Footnote.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  label: { type: 'text', optional: true },
  contentNodes: { type: ['id'], default: [] }
});

module.exports = Footnote;
