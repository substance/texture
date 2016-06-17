'use strict';

var JATS = require('../JATS');
var XMLIterator = require('../../../util/XMLIterator');

module.exports = {

  type: 'section',
  tagName: 'sec',
  canContain: ['sec-meta', 'label', 'title']
    .concat(JATS.PARA_LEVEL)
    .concat(["sec","notes","fn-group","glossary","ref-list"]),

  /*
    Attributes
      disp-level Display Level of a Heading
      id Document Internal Identifier
      sec-type Type of Section
      specific-use Specific Use
      xml:base Base
      xml:lang Language

    Content
    (
      sec-meta?, label?, title?,
      ( address | alternatives | array |
        boxed-text | chem-struct-wrap | code | fig | fig-group |
        graphic | media | preformat | supplementary-material | table-wrap |
        table-wrap-group | disp-formula | disp-formula-group | def-list |
        list | tex-math | mml:math | p | related-article | related-object |
        ack | disp-quote | speech | statement | verse-group | x
      )*,
      (sec)*,
      (notes | fn-group | glossary | ref-list)*
    )
  */

  import: function(el, node, converter) {

    var children = el.getChildren();
    var iterator = new XMLIterator(children);

    iterator.optional('sec-meta', function(child) {
      node.meta = converter.convertElement(child).id;
    });
    iterator.optional('label', function(child) {
      node.label = converter.annotatedText(child, [node.id, 'label']);
    });
    iterator.optional('title', function(child) {
      node.title = converter.annotatedText(child, [node.id, 'title']);
    });

    iterator.manyOf(JATS.PARA_LEVEL, function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });

    iterator.manyOf(['sec'], function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });

    iterator.manyOf(["notes","fn-group","glossary","ref-list"], function(child) {
      node.backMatter.push(converter.convertElement(child).id);
    });

    if (iterator.hasNext()) {
      throw new Error('Illegal JATS: ' + el.outerHTML);
    }
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;

    el.attr(node.xmlAttributes);
    if (node.meta) {
      el.append(
        $$('sec-meta').append(
          converter.convertNode(node.meta)
        )
      );
    }
    if(node.label) {
      el.append(
        $$('label').append(
          converter.annotatedText([node.id, 'label'])
        )
      );
    }
    if(node.title) {
      el.append(
        $$('title').append(
          converter.annotatedText([node.id, 'title'])
        )
      );
    }
    node.nodes.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId));
    });
    node.backMatter.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId));
    });
  }

};
