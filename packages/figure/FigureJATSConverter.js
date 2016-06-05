'use strict';

module.exports = {

  type: 'figure',
  tagName: 'fig',
  allowedContext: [
    'abstract', 'ack', 'app', 'app-group', 'bio', 'body', 'boxed-text',
    'disp-quote', 'fig-group', 'floats-group', 'glossary', 'license-p',
    'named-content', 'notes', 'p', 'ref-list', 'sec', 'styled-content',
    'trans-abstract'
  ],

  /*
    Spec: http://jats.nlm.nih.gov/archiving/tag-library/1.1/element/fig.html

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
    node.xmlAttributes = el.getAttributes();
    var children = el.getChildren();
    children.forEach(function(childEl) {
      var tagName = childEl.tagName;
      switch (tagName) {
        case 'object-id':
          node.objectIds.push(childEl.textContent);
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
        case 'table': // this is not JATS-spec-conform
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
        case 'alt-text':
        case 'long-desc':
        case 'email':
        case 'ext-link':
        case 'uri':
          console.warn('<fig>.<%s> is not yet implemented.', tagName);
          node.contentNodes.push(converter.convertElement(childEl).id);
          break;
        default:
          console.warn('Unhandled element <%s> in <fig>.', tagName);
          node.contentNodes.push(converter.convertElement(childEl).id);
      }
    });
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;
    node.objectIds.forEach(function(objectId) {
      el.append($$('object-id').text(objectId));
    });
    if (node.label) {
      el.append(converter.annotatedText([node.id, 'label']));
    }
    el.append(converter.convertNodes(node.captionNodes));
    el.append(converter.convertNodes(node.abstractNodes));
    el.append(converter.convertNodes(node.kwdGroupNodes));
    el.append(converter.convertNodes(node.contentNodes));
  }

};
