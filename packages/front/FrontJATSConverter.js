'use strict';

module.exports = {

  type: 'front',
  tagName: 'front',

  allowedContext: "article",

  /*
    Attributes
      id Document Internal Identifier
      xml:base Base
    Content
      (
        journal-meta?, article-meta,
        (def-list | list | ack | bio | fn-group | glossary | notes)*
      )
  */

  import: function(el, node, converter) {
    node.id = this.tagName;
    var children = el.getChildren();
    var i = 0;
    var child;
    if ((child = children[i]) && child.tagName === 'journal-meta') {
      node.journalMeta = converter.convertElement(child).id;
      i++;
    }
    if ((child = children[i]) && child.tagName === 'article-meta') {
      node.articleMeta = converter.convertElement(child).id;
      i++;
    } else {
      throw new Error('Invalid JATS: <article-meta> is mandatory in <front>');
    }
    node.nodes = converter._convertContainerElement(el, i);
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    if (node.journalMeta) {
      el.append(converter.convertNode(node.journalMeta));
    }
    el.append(converter.convertNode(node.articleMeta));
    el.append(converter.convertNodes(node.nodes));
  }

};
