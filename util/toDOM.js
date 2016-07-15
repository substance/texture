'use strict';

var DOMElement = require('substance/ui/DefaultDOMElement');

/*
  Converts a node into its DOM representation

  @return {substance/ui/DOMElement} A wrapped DOM element
*/
module.exports = function toDOM(node) {
  var tagName = node.constructor.static.tagName || node.constructor.static.name;
  var el = DOMElement.parseXML('<'+tagName+'>'+node.xmlContent+'</'+tagName+'>');
  el.attr(node.attributes);
  return el;
};