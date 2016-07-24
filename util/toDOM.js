'use strict';

var DOMElement = require('substance/ui/DefaultDOMElement');

/*
  Converts a node into its DOM representation

  @return {substance/ui/DOMElement} A wrapped DOM element
*/
module.exports = function toDOM(node) {
  var tagName = node.constructor.tagName || node.constructor.type;
  var el = DOMElement.parseXML('<'+tagName+'>'+node.xmlContent+'</'+tagName+'>');
  el.attr(node.attributes);
  return el;
};