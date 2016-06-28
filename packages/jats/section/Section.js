'use strict';

var Container = require('substance/model/Container');

function Section() {
  Section.super.apply(this, arguments);
}

Section.Prototype = function() {

  this.getTitle = function() {
    var titleNode = this.getDocument().get(this.title);
    if (titleNode) {
      return titleNode.getText();
    }
  };
}

Container.extend(Section);

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
  xmlAttributes: { type: 'object', default: {} },
  meta: { type: 'id', optional: true },
  label: { type: 'id', optional:true },
  title: { type: 'id', optional: true },
  nodes: { type: ['id'], default: [] },
  backMatter: { type: ['id'], default: [] }
});

module.exports = Section;
