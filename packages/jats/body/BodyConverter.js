'use strict';

var JATS = require('../JATS');
var XMLIterator = require('../../../util/XMLIterator');

module.exports = {

  type: 'body',
  tagName: 'body',

  /*
    Attributes
      id Document Internal Identifier
      specific-use Specific Use
      xml:base Base

    Content
      %para_level*,
      (sec)*,
      sig-block?
  */

  import: function(el, node, converter) {
    node.id = 'body'; // there is only be one body element
    node.xmlAttributes = el.getAttributes();

    var children = el.getChildren();
    var iterator = new XMLIterator(children);
    iterator.manyOf(JATS.PARA_LEVEL, function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });
    iterator.manyOf('sec', function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });
    iterator.optional('sig-block', function(child) {
      node.sigBlock = converter.convertElement(child).id;
    });
    if (iterator.hasNext()) throw new Error('Illegal JATS: ' + el.outerHTML);
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    el.append(converter.convertNodes(node.nodes));
    if (node.sigBlock) {
      el.append(converter.convertNode(node.sigBlock));
    }
  }

};
