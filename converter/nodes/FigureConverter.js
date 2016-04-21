'use strict';

var forEach = require('lodash/forEach');

module.exports = {

  type: 'figure',
  tagName: 'fig',
  allowedContext: [
    'abstract', 'ack', 'app', 'back', 'bio', 'body', 'boxed-text',
    'notes', 'sec', 'trans-abstract'
  ],

  /*
    Attributes
      fig-type Type of Figure
      id Document Internal Identifier
      orientation Orientation
      position Position
      specific-use Specific Use
      xml:base Base
      xml:lang Language

    Content
    (
      (object-id)*,
      label?, (caption)*, (abstract)*, (kwd-group)*,
      (alt-text | long-desc | email | ext-link | uri)*,
      (disp-formula | disp-formula-group | chem-struct-wrap | disp-quote | speech |
        statement | verse-group | table-wrap | p | def-list | list | alternatives |
        array | code | graphic | media | preformat)*,
      (attrib | permissions)*
    )
  */

  import: function(el, node, converter) {
    // var state = converter.state;
    var childNodes = el.getChildNodes();

    debugger;
    node.attributes = converter._extractXMLAttributes(el);

    forEach(childNodes, function(childNode) {
      var tagName = childNode.tagName;


      switch (tagName) {
        case 'object-id':
          node.objectIdNodes.push(this.convertElement(childNode));
          break;
        case 'label':
          node.label = converter.annotatedText(childNodes, [node.id, 'label']);
          break;
        case 'caption':
          node.captionNodes.push(this.convertElement(childNode));
          break;
        case 'abstract':
          node.abstractNodes.push(this.convertElement(childNode));
          break;
        case 'kwd-group':
          node.kwdGroupNodes.push(this.convertElement(childNode));
          break;
        case 'disp-formula':
        case 'disp-formula-group':
        case 'chem-struct-wrap':
        case 'disp-quote':
        case 'speech':
        case 'statement':
        case 'verse-group':
        case 'table-wrap':
        case 'p':
        case 'def-list':
        case 'list':
        case 'alternatives':
        case 'array':
        case 'code':
        case 'graphic':
        case 'media':
        case 'preformat':
          node.contentNodes.push(this.convertElement(childNode));
          break;
        case 'attrib':
        case 'permissions':
          node.attribNodes.push(this.convertElement(childNode));
          break;
        default:
          console.warn('Unhandled content in <fig>. Appending to node.contentNodes.');
          node.contentNodes.push(this.convertElement(childNode));
      }
    });
  },

  export: function(node, el, converter) {
    // jshint unused:false
  }

};
