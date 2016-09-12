'use strict';

import JATS from '../JATS'
import XMLIterator from '../../../util/XMLIterator'

var REFLIST_CONTENT = ['ref', 'ref-list'].concat(JATS.PARA_LEVEL);

export default {

  type: 'ref-list',
  tagName: 'ref-list',

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
      el.append(converter.convertNode(node.label));
    }
    if(node.title) {
      el.append(converter.convertNode(node.title));
    }
    el.append(converter.convertNodes(node.nodes));
  }

};
