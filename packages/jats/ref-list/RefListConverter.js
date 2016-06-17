'use strict';

var JATS = require('../JATS');
var XMLIterator = require('../../../util/XMLIterator');

var REFLIST_CONTENT = ['ref', 'ref-list'].concat(JATS.PARA_LEVEL);

module.exports = {

  type: 'ref-list',
  tagName: 'ref-list',
  canContain: ['label', 'title'].concat(REFLIST_CONTENT),


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
    var iterator = new XMLIterator(el.getChildren());
    iterator.optional('label', function(child) {
      node.label = converter.convertElement(child).id;
    });
    iterator.optional('title', function(child) {
      node.title = converter.convertElement(child).id;
    });
    iterator.manyOf(REFLIST_CONTENT, function(child) {
      node.nodes.push(converter.convertElement(child).id);
    });
    if (iterator.hasNext()) throw new Error('Illegal JATS: ' + el.outerHTML);
  },

  export: function(node, el, converter) {
    if(node.label) {
      el.append(converter.annotatedText(node.label));
    }
    if(node.title) {
      el.append(converter.annotatedText(node.title));
    }
    node.nodes.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId));
    });
    node.refLists.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId));
    });
  }

};
