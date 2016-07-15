'use strict';

var JATS = require('../JATS');
var XMLIterator = require('../../../util/XMLIterator');

module.exports = {

  type: 'title-group',
  tagName: 'title-group',

  /*
    Attributes
      id Document Internal Identifier
      specific-use Specific Use
      xml:base Base

    Content
      %title-group-model;
  */

  import: function(el, node, converter) {
    node.id = 'title-group'; // there is only be one body element
    node.xmlAttributes = el.getAttributes();

    var children = el.getChildren();
    var iterator = new XMLIterator(children);

    // TODO: This is not strict enough. We want to check for the
    // element cardinalities:
    //   (article-title, subtitle*, trans-title-group*, alt-title*, fn-group?)
    // We may want to use a helper for this (see #64)
    iterator.manyOf(JATS.TITLE_GROUP, function(child) {
      node.nodes.push(converter.convertElement(child).id);
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
