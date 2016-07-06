'use strict';

var Container = require('substance/model/Container');

function Footnote() {
  Footnote.super.apply(this, arguments);
}

Container.extend(Footnote);

Footnote.static.name = 'footnote';

/*
  Content
    (label?, p+)
*/
Footnote.static.defineSchema({
  attributes: { type: 'object', default: {} },
  label: { type: 'label', optional: true },
  nodes: { type: ['p'], default: [] }
});

module.exports = Footnote;
