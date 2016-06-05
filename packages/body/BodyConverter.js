'use strict';

var ArrayIterator = require('substance/util/ArrayIterator');

module.exports = {

  type: 'body',
  tagName: 'body',
  allowedContext: "article",

  /*
    Attributes
      id Document Internal Identifier
      specific-use Specific Use
      xml:base Base

    Content
    (
      (
        address | alternatives | array | boxed-text | chem-struct-wrap | code | fig | fig-group | graphic |
        media | preformat | supplementary-material | table-wrap | table-wrap-group |
        disp-formula | disp-formula-group | def-list | list | tex-math | mml:math | p | related-article |
        related-object | ack | disp-quote | speech | statement | verse-group | x
      )*,
      (sec)*,
      sig-block?
    )
  */

  import: function(el, node, converter) {
    node.id = 'body';
    node.nodes = converter._convertContainerElement(el);
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    // EXPERIMENTAL
    // TODO: iron out section handling
    converter.sectionContainerIterator = new ArrayIterator(node.nodes);
    el.append(converter.convertNodes(converter.sectionContainerIterator));
  }

};
