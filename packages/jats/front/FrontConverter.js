'use strict';

import XMLIterator from '../../../util/XMLIterator'

var FRONT_CONTENT = ['def-list', 'list', 'ack', 'bio', 'fn-group', 'glossary', 'notes'];

export default {

  type: 'front',
  tagName: 'front',

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
    node.id = 'front'; // there is only one <front> element
    var iterator = new XMLIterator(el.getChildren());
    iterator.optional('journal-meta', function(child) {
      node.journalMeta = converter.convertElement(child).id;
    });
    iterator.required('article-meta', function(child) {
      node.articleMeta = converter.convertElement(child).id;
    });
    iterator.manyOf(FRONT_CONTENT, function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });
    if (iterator.hasNext()) throw new Error('Illegal JATS: ' + el.outerHTML);
  },

  export: function(node, el, converter) {
    if (node.journalMeta) {
      el.append(converter.convertNode(node.journalMeta));
    }
    el.append(converter.convertNode(node.articleMeta));
    el.append(converter.convertNodes(node.nodes));
  }
};
