'use strict';

var JATS = require('../JATS');
var XMLIterator = require('../../../util/XMLIterator');

var GRAPHIC_ELEMENTS = JATS.ACCESS
    .concat(JATS.ADDRESS_LINK)
    .concat(['caption', 'object-id', 'kwd-group', 'label'])
    .concat(JATS.DISPLAY_BACK_MATTER);

module.exports = {

  type: 'graphic',
  tagName: 'graphic',

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
  canContain: GRAPHIC_ELEMENTS,

  import: function(el, node, converter) {
    var iterator = new XMLIterator(el.getChildren());
    iterator.manyOf(GRAPHIC_ELEMENTS, function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });
    if (iterator.hasNext()) throw new Error('Illegal JATS: ' + el.outerHTML);
  },

  export: function(node, el, converter) {
    el.append(converter.convertNodes(node.nodes));
  }

};
