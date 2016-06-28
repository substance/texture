'use strict';

var XMLIterator = require('../../../util/XMLIterator');

module.exports = {

  type: 'caption',
  tagName: 'caption',

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
    // title is just annotated text
    iterator.optional('title', function(childEl) {
      node.title = converter.convertElement(childEl).id;
    });
    iterator.manyOf('p', function(childEl) {
      node.nodes.push(converter.convertElement(childEl).id);
    });
    if (iterator.hasNext()) {
      throw new Error('Invalid JATS:' + el.outerHTML);
    }
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    if (node.title) el.append(converter.convertNode(node.title));
    el.append(converter.convertNodes(node.nodes));
  }

};
