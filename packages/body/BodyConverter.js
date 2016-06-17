'use strict';

var XMLIterator = require('../../util/XMLIterator');

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
        address | alternatives | array | boxed-text | chem-struct-wrap | code | fig | fig-group | graphic |
        media | preformat | supplementary-material | table-wrap | table-wrap-group |
        disp-formula | disp-formula-group | def-list | list | tex-math | mml:math | p | related-article |
        related-object | ack | disp-quote | speech | statement | verse-group | x
      )*,
      (sec)*,
      sig-block?
  */

  import: function(el, node, converter) {
    node.id = 'body'; // there is only be one body element
    node.xmlAttributes = el.getAttributes();

    var children = el.getChildren();
    var iterator = new XMLIterator(children);
    iterator.manyOf([
      "address","alternatives","array","boxed-text",
      "chem-struct-wrap","code","fig","fig-group","graphic",
      "media","preformat","supplementary-material",
      "table-wrap","table-wrap-group",
      "disp-formula","disp-formula-group","def-list","list",
      "tex-math","mml:math","p","related-article",
      "related-object","ack","disp-quote","speech",
      "statement","verse-group","x"],
      function(child) {
        node.nodes.push(converter.convertElement(child).id);
      }
    );
    iterator.manyOf('sec', function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });
    iterator.optional('sig-block', function(child) {
      node.sigBlock = converter.convertElement(child).id;
    });
    if (iterator.hasNext()) {
      throw new Error('Illegal JATS: ' + el.outerHTML);
    }
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    el.append(converter.convertNodes(node.nodes));
  }

};
