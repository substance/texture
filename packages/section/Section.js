'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Section() {
  Section.super.apply(this, arguments);
}

DocumentNode.extend(Section);

Section.static.name = "section";

/*
  Content Model
    ( sec-meta?, label?, title?,
      ( address | alternatives | array | boxed-text | chem-struct-wrap | code |
        fig | fig-group | graphic | media | preformat | supplementary-material |
        table-wrap | table-wrap-group | disp-formula | disp-formula-group |
        def-list | list | tex-math | mml:math | p | related-article | related-object |
        ack | disp-quote | speech | statement | verse-group | x)*,
      (sec)*,
      (notes | fn-group | glossary | ref-list)*
    )
*/

Section.static.defineSchema({
  meta: { type: 'id' },
  label: { type: 'text' },
  title: { type: 'text' },
  contentNodes: { type: ['id'], default: [] },
});

module.exports = Section;
