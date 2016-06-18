'use strict';

var XMLIterator = require('../../../util/XMLIterator');

module.exports = {

  type: 'footnote',
  tagName: 'fn',
  /*
    Attributes
      fn-type Type of Footnote
      id Document Internal Identifier
      specific-use Specific Use
      symbol Symbol
      xml:base Base
      xml:lang Language

    Content
      (label?, (p)+)
  */

  import: function(el, node, converter) {
    var iterator = new XMLIterator(el.getChildren());
    iterator.optional('label', function(child) {
      node.label = converter.convertElement(child).id;
    });
    iterator.oneOrMoreOf('p', function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });
    if (iterator.hasNext()) throw new Error('Illegal JATS: ' + el.outerHTML);
  },

  export: function(node, el, converter) {
    if (node.label) {
      el.append(converter.convertNode(node.label));
    }
    el.append(converter.convertNodes(node.nodes));
  }

};
