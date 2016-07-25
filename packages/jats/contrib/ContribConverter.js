'use strict';

module.exports = {

  type: 'contrib',
  tagName: 'contrib',

  /*
    (label?, (citation-alternatives | element-citation | mixed-citation | nlm-citation | note | x)+)
  */
  import: function(el, node, converter) { // eslint-disable-line
    node.xmlContent = el.innerHTML;
    node.tagName = el.tagName;
  },

  export: function(node, el, converter) { // eslint-disable-line
    el.innerHTML = node.xmlContent;
  }
};
