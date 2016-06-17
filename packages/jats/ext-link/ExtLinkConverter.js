'use strict';

var JATS = require('../JATS');

module.exports = {

  type: "link",
  tagName: "ext-link",

  canContain: JATS.ALL_PHRASE,

  /*
    Attributes
    assigning-authority Authority Responsible for an Identifier
    ext-link-type Type of External Link
    id Document Internal Identifier
    specific-use Specific Use
    xlink:actuate Actuating the Link
    xlink:href Href (Linking Mechanism)
    xlink:role Role of the Link
    xlink:show Showing the Link
    xlink:title Title of the Link
    xlink:type Type of Link
    xml:base Base
    xml:lang Language
    xmlns:xlink XLink Namespace Declaration

    Content
    (#PCDATA | email | ext-link | uri | inline-supplementary-material |
      related-article | related-object | hr | bold | fixed-case | italic |
      monospace | overline | overline-start | overline-end | roman | sans-serif
      | sc | strike | underline | underline-start | underline-end | ruby |
      alternatives | inline-graphic | private-char | chem-struct | inline-formula |
      tex-math | mml:math | abbrev | milestone-end | milestone-start | named-content |
      styled-content | fn | target | xref | sub | sup | x)*
  */

  import: function(el, node) {
    // ATTENTION: this is not implemented correctly yet
    node.xmlAttributes = el.getAttributes();
    node.url = el.attr('xlink:href');
    node.title = el.attr('xlink:title');
  },

  export: function(node, el) {
    // ATTENTION: this is not implemented correctly yet
    el.attr(node.xmlAttributes);
    el.attr({
      'xlink:href': node.url,
      'xlink:title': node.title
    });
  }
};

