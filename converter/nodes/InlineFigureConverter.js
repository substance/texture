'use strict';

var forEach = require('lodash/forEach');

module.exports = {

  type: 'inline-figure',
  tagName: 'fig',
  allowedContext: [
    'abstract', 'ack', 'app', 'app-group', 'bio', 'body', 'boxed-text',
    'disp-quote', 'fig-group', 'floats-group', 'glossary', 'license-p', 
    'named-content', 'notes', 'p', 'ref-list', 'sec', 'styled-content',
    'trans-abstract'
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
    var childEls = el.getChildNodes();

    node.xmlAttributes = el.getAttributes();

    forEach(childEls, function(childEl) {
      var tagName = childEl.tagName;

      switch (tagName) {
        case 'object-id':
          node.objectIdNodes.push(converter.convertElement(childEl).id);
          break;
        case 'label':
          node.label = converter.annotatedText(childEl, [node.id, 'label']);
          break;
        case 'caption':
          node.captionNodes.push(converter.convertElement(childEl).id);
          break;
        case 'abstract':
          node.abstractNodes.push(converter.convertElement(childEl).id);
          break;
        case 'kwd-group':
          node.kwdGroupNodes.push(converter.convertElement(childEl).id);
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
          node.contentNodes.push(converter.convertElement(childEl).id);
          break;
        case 'attrib':
        case 'permissions':
          node.attribNodes.push(converter.convertElement(childEl).id);
          break;
        default:
          console.warn('Unhandled content in <fig>. Appending to node.contentNodes.');
          node.contentNodes.push(converter.convertElement(childEl));
      }
    });
  },

  export: function(node, el, converter) {
    // jshint unused:false
  }

};
