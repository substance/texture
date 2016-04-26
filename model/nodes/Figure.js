'use strict';

// TODO: we should be able to inherit from JATSNode to share properties.

var DocumentNode = require('substance/model/DocumentNode');

function Figure() {
  Figure.super.apply(this, arguments);
}

DocumentNode.extend(Figure);

Figure.static.name = 'figure';

/*
  Content
    (
      (object-id)*,
      label?, (caption)*, (abstract)*, (kwd-group)*,
      (alt-text | long-desc | email | ext-link | uri)*,
      (disp-formula | disp-formula-group | chem-struct-wrap | disp-quote | speech |
        statement | verse-group | table-wrap | p | def-list | list | alternatives |
        array | code | graphic | media | preformat)*,
      (attrib | permissions)*
    )
*/
Figure.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  objectIds: { type: ['string'], default: [] },
  label: { type: 'text', optional: true },
  captionNodes: { type: ['id'], default: [] },
  abstractNodes: { type: ['id'], default: [] },
  kwdGroupNodes: { type: ['id'], default: [] },
  contentNodes: { type: ['id'], default: [] },
  attribNodes: { type: ['id'], default: [] },
});

module.exports = Figure;