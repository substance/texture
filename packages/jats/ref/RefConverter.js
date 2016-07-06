'use strict';

module.exports = {

  type: 'ref',
  tagName: 'ref',

  /*
    (label?, (citation-alternatives | element-citation | mixed-citation | nlm-citation | note | x)+)
  */
  import: function(el, node, converter) { // eslint-disable-line
    node.xmlContent = el.innerHTML;
  },

  export: function(node, el, converter) { // eslint-disable-line
    el.innerHTML = node.xmlContent;
  }

};
