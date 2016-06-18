'use strict';

var JATS = require('../JATS');
var XMLIterator = require('../../../util/XMLIterator');

var ACCESS_OR_LINK = JATS.ACCESS.concat(JATS.ADDRESS_LINK);
var FIGURE_CONTENT = JATS.BLOCK_MATH
  .concat(JATS.CHEM_STRUCT)
  .concat(JATS.INTABLE_PARA)
  .concat(JATS.JUST_TABLE)
  .concat(JATS.JUST_PARA)
  .concat(JATS.LIST)
  .concat(JATS.SIMPLE_DISPLAY);

module.exports = {

  type: 'figure',
  tagName: 'fig',

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

    var iterator = new XMLIterator(el.getChildren());
    iterator.manyOf('object-id', function(child) {
      node.objectIds.push(child.textContent);
    });
    iterator.optional('label', function(child) {
      node.label = converter.convertElement(child).id;
    });
    iterator.manyOf('caption', function(child) {
      node.captions.push(converter.convertElement(child).id);
    });
    iterator.manyOf('abstract', function(child) {
      node.abstracts.push(converter.convertElement(child).id);
    });
    iterator.manyOf('kwd-group', function(child) {
      node.kwdGroups.push(converter.convertElement(child).id);
    });
    iterator.manyOf(ACCESS_OR_LINK, function(child) {
      var childNode = converter.convertElement(child);
      switch(child.tagName) {
        case "alt-text":
          node.altTexts.push(childNode.id);
          break;
        case "long-desc":
          node.longDesc.push(childNode.id);
          break;
        case "ext-link":
          node.extLinks.push(childNode.id);
          break;
        case "uri":
          node.uris.push(childNode.id);
          break;
        case "email":
          node.emails.push(childNode.id);
          break;
        default:
          //nothing
      }
    });
    iterator.manyOf(FIGURE_CONTENT, function(child) {
      node.contentNodes.push(converter.convertElement(child).id);
    });
    iterator.manyOf(JATS.DISLAY_BACK_MATTER, function(child) {
      node.backMatter.push(converter.convertElement(child).id);
    });
    if (iterator.hasNext()) {
      throw new Error('Illegal JATS: ' + el.outerHTML);
    }
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;
    node.objectIds.forEach(function(objectId) {
      el.append($$('object-id').text(objectId));
    });
    if (node.label) {
      el.append(
        $$('label').append(converter.annotatedText([node.id, 'label']))
      );
    }
    el.append(converter.convertNodes(node.captionNodes));
    el.append(converter.convertNodes(node.abstractNodes));
    el.append(converter.convertNodes(node.kwdGroupNodes));
    if (node.altText) {
      el.append(
        $$('alt-text').append(node.altText)
      );
    }
    if (node.longDesc) {
      el.append(
        $$('long-desc').append(node.longDesc)
      );
    }
    if (node.extLink) {
      el.append(
        $$('ext-link').append(converter.annotatedText([node.id, 'extLink']))
      );
    }
    if (node.uri) {
      el.append(
        $$('uri').append(converter.annotatedText([node.id, 'uri']))
      );
    }
    if (node.email) {
      el.append(
        $$('email').append(converter.annotatedText([node.id, 'email']))
      );
    }
    el.append(converter.convertNodes(node.contentNodes));
    el.append(converter.convertNodes(node.backMatter));
  }
};
