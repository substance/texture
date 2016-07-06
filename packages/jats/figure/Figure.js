'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Figure() {
  Figure.super.apply(this, arguments);
}

DocumentNode.extend(Figure);

Figure.static.name = 'figure';

/*
  Attribute
    fig-type Type of Figure
    id Document Internal Identifier
    orientation Orientation
    position Position
    specific-use Specific Use
    xml:base Base
    xml:lang Language

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
  attributes: { type: 'object', default: {} },
  objectIds: { type: ['string'], default: [] },
  label: { type: 'label', optional: true },
  captions: { type: ['caption'], default: [] },
  abstracts: { type: ['abstract'], default: [] },
  kwdGroups: { type: ['kwd-group'], default: [] },
  altTexts: { type: ['alt-text'], default: [] },
  longDescs: { type: ['long-desc'], default: [] },
  emails: { type: ['email'], default: [] },
  extLinks: { type: ['ext-link'], default: [] },
  uris: { type: ['uri'], default: [] },
  contentNodes: { type: ['id'], default: [] },
  attribs: { type: ['attrib'], default: [] },
  permissions: { type: ['permissions'], default: [] },
});

module.exports = Figure;
