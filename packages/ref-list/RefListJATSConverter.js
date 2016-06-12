'use strict';

var XMLIterator = require('../../util/XMLIterator');

module.exports = {

  type: 'ref-list',
  tagName: 'ref-list',

  allowedContext: [
    'abstract', 'ack', 'app', 'app-group', 'back', 'bio', 'boxed-text', 'notes', 'ref-list', 'sec', 'trans-abstract'
  ],

  /*
    (
      label?,
      title?,
      (
        address | alternatives | array | boxed-text | chem-struct-wrap | code | fig |
        fig-group | graphic | media | preformat | supplementary-material | table-wrap |
        table-wrap-group | disp-formula | disp-formula-group | def-list | list | tex-math |
        mml:math | p | related-article | related-object | ack | disp-quote | speech | statement |
        verse-group | x | ref
      )*,
      (ref-list)*
    )
  */
  import: function(el, node, converter) {
    var children = el.getChildren();
    var iterator = new XMLIterator(children);

    node.xmlAttributes = el.getAttributes();

    iterator.optional('label', function(child) {
      node.label = converter.annotatedText(child, [node.id, 'label']);
    });

    iterator.optional('title', function(child) {
      node.title = converter.annotatedText(child, [node.id, 'title']);
    });

    iterator.manyOf([
      'address', 'alternatives', 'array', 'boxed-text', 'chem-struct-wrap', 'code', 'fig',
      'fig-group', 'graphic', 'media', 'preformat', 'supplementary-material', 'table-wrap',
      'table-wrap-group', 'disp-formul', 'disp-formula-grou', 'def-lis', 'lis', 'tex-math',
      'mml:mat', 'related-articl', 'related-objec', 'ac', 'disp-quot', 'speec', 'statement',
      'verse-grou', 'ref'
    ], function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });

    iterator.manyOf(['ref-list'], function(child) {
      node.refLists.push(converter.convertElement(child).id);
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
    node.refLists.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId));
    });
  }

};
