'use strict';

var XMLIterator = require('../../util/XMLIterator');

module.exports = {

  type: 'back',
  tagName: 'back',

  allowedContext: [
    'article', 'response', 'sub-article'
  ],

  /*
    (label?, title*, (ack | app-group | bio | fn-group | glossary | ref-list | notes | sec)*)
  */
  import: function(el, node, converter) {
    node.id = 'back'; // There can only be one back item
    node.xmlAttributes = el.getAttributes();

    var children = el.getChildren();
    var iterator = new XMLIterator(children);

    iterator.optional('label', function(child) {
      node.label = converter.annotatedText(child, [node.id, 'label']);
    });

    iterator.manyOf(['title'], function(child) { // eslint-disable-line
      // Spec is confusing: What should be a title in the back at all,
      // and what do multiple titles mean?
      throw new Error("We don't yet support a title element here");
    });

    iterator.manyOf([
      "ack", "app-group", "bio", "fn-group", "glossary", "ref-list", "notes", "sec"
    ], function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });

    if (iterator.hasNext()) {
      throw new Error('Illegal JATS: ' + el.outerHTML);
    }
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;

    el.attr(node.xmlAttributes);
    if(node.label) {
      el.append(
        $$('label').append(converter.annotatedText([node.id, 'label']))
      );
    }
    if(node.title) {
      el.append(
        $$('title').append(converter.annotatedText([node.id, 'title']))
      );
    }
    node.nodes.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId));
    });
  }

};
