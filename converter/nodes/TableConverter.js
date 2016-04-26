'use strict';

module.exports = {

  type: 'table', // Substance node model
  tagName: 'table', // Used as a matcher

  allowedContext: [
    'table-wrap'
  ],

  import: function(el, node) {
    node.xmlAttributes = el.getAttributes();
    node.htmlContent = el.innerHTML;
  },

  export: function(node, el) {
    el.attr(node.xmlAttributes);
    el.html(node.htmlContent);
  }
};
