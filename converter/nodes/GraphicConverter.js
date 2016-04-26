'use strict';

module.exports = {

  type: 'graphic',
  tagName: 'graphic',

  allowedContext: [
    'abstract', 'ack', 'alternatives', 'app', 'app-group', 'array', 'bio', 'body',
    'boxed-text', 'chem-struct', 'chem-struct-wrap', 'disp-formula', 'disp-quote',
    'fig', 'fig-group', 'floats-group', 'glossary', 'license-p', 'named-content',
    'notes', 'p', 'ref-list', 'sec', 'sig', 'sig-block', 'styled-content',
    'supplementary-material', 'table-wrap', 'td', 'term', 'th', 'trans-abstract'
  ],

  /*
    Attributes
    content-type Type of Content
    id Document Internal Identifier
    mime-subtype Mime Subtype
    mimetype Mime Type
    orientation Orientation
    position Position
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
    (
      alt-text | long-desc | abstract | email | ext-link | uri | caption |
      object-id | kwd-group | label | attrib | permissions
    )*
  */

  import: function(el, node, converter) {
    /* jshint unused:false */
    // TODO this needs more treatment
    node.href = el.attr('xlink:href');
    var children = el.getChildren();
    children.forEach(function(childEl) {
      node.children.push(converter.convertElement(childEl).id);
    });
  },

  export: function(node, el, converter) {
    /* jshint unused:false */
    // TODO this needs more treatment
    el.attr(node.xmlAttributes);
    el.attr({
      'xlink:href': node.href
    });
    el.append(converter.convertNodes(node.children));
  }

};
