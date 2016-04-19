'use strict';

var Body = require('../../model/nodes/Body');

module.exports = {

  type: 'body',
  tagName: 'body',

  allowedContext: Body.static.allowedContext,

  /*
    Attributes
      id Document Internal Identifier
      specific-use Specific Use
      xml:base Base

    Content
    (
     (address | alternatives | array | boxed-text | chem-struct-wrap | code | fig | fig-group | graphic | media | preformat | supplementary-material | table-wrap | table-wrap-group | disp-formula | disp-formula-group | def-list | list | tex-math | mml:math | p | related-article | related-object | ack | disp-quote | speech | statement | verse-group | x)*,
     (sec)*,
     sig-block?
    )
  */

  import: function(el, node, converter) {
    node.id = this.tagName;
    // TODO: to be strict we should enforce that only sections and sig-block can be
    // converted after the first section
    converter._convertContainerElement(el, node);
  },

  export: function(node, el, converter) {
    el.append(converter.convertContainer(node));
  }

};
