'use strict';

var XMLIterator = require('../../util/XMLIterator');

module.exports = {

  type: 'caption',
  tagName: 'caption',
  allowedContext: [
    'boxed-text', 'chem-struct-wrap', 'disp-formula-group', 'fig', 'fig-group', 'graphic',
    'media', 'supplementary-material', 'table-wrap', 'table-wrap-group'
  ],

  /*
    Attributes
    content-type Type of Content
    id Document Internal Identifier
    specific-use Specific Use
    style Style (NISO JATS table model; MathML Tag Set)
    xml:base Base
    xml:lang Language

    Content
      ( title?, (p)* )
  */

  import: function(el, node, converter) {
    node.xmlAttributes = el.getAttributes();

    var children = el.getChildren();
    var iterator = new XMLIterator(children);

    iterator.optional(function(childEl) {
      node.title = converter.annotatedText(childEl, [node.id, 'title']);
    });

    iterator.manyOf(['p'], function(childEl) {
      node.nodes.push(converter.convertElement(childEl).id);
    });

    if (iterator.hasNext()) {
      throw new Error('Invalid JATS:' + el.outerHTML);
    }
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;
    el.attr(node.xmlAttributes);
    el.append(
      $$('title').append(converter.annotatedText([node.id, 'title']))
    );
    el.append(converter.convertNodes(node.nodes));
  }

};
