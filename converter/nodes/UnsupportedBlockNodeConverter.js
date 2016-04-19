'use strict';

module.exports = {

  type: 'unsupported-block',

  matchElement: function() {
    return true;
  },

  import: function(el, node, converter) {
    node.xml = el.outerHTML;
    node.tagName = el.tagName;
  },

  export: function(node, el, converter) {
    el.innerHTML = node.xml;
    return el.children[0];
  }

};
