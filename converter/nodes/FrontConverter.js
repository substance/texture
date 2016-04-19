'use strict';

var Front = require('../../model/nodes/Front');

module.exports = {

  type: 'front',
  tagName: 'front',

  allowedContext: Front.static.allowedContext,

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
    var childNodes = el.getChildNodes();
    var i = 0;
    if (childNodes[i].tagName === 'journal-meta') {
      var journalMeta = converter.convertElement(childNodes[i]);
      node.journalMeta = journalMeta.id;
      i++;
    }
    if (childNodes[i].tagName !== 'article-meta') {
      throw new Error('<article-meta> is mandatory');
    } else {
      var articleMeta = converter.convertElement(childNodes[i]);
      node.articleMeta = articleMeta.id;
    }
    converter._convertContainerElement(el, node, i);
  },

  export: function(node, el, converter) {
    el.append(converter.convertContainer(node));
  }

};
