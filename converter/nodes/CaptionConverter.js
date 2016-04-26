'use strict';

module.exports = {

  type: 'caption',
  tagName: 'caption',
  allowedContext: [
    'boxed-text', 'chem-struct-wrap', 'disp-formula-group', 'fig', 'fig-group', 'graphic',
    'media', 'supplementary-material', 'table-wrap', 'table-wrap-group'
  ],

  /*
    Attributes
    content-type Type of Content
    id Document Internal Identifier
    specific-use Specific Use
    style Style (NISO JATS table model; MathML Tag Set)
    xml:base Base
    xml:lang Language

    Content
      ( title?, (p)* )
  */

  import: function(el, node, converter) {
    node.xmlAttributes = el.getAttributes();
    var children = el.getChildren();
    children.forEach(function(childEl) {
      var tagName = childEl.tagName;
      switch (tagName) {
        case 'title':
          node.title = converter.annotatedText(childEl, [node.id, 'title']);
          break;
        case 'p':
          node.contentNodes.push(converter.convertElement(childEl).id);
          break;
        default:
          console.warn('Unhandled content in <caption>. Appending to node.contentNodes.');
          node.contentNodes.push(converter.convertElement(childEl));
      }
    });
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;
    el.attr(node.xmlAttributes);
    el.append(
      $$('title').append(converter.annotatedText([node.id, 'title']))
    );
    el.append(converter.convertNodes(node.contentNodes));
  }

};
