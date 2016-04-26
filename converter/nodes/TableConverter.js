'use strict';

module.exports = {

  type: 'table', // Substance node model
  tagName: 'table', // Used as a matcher

  allowedContext: [
    'table-wrap'
  ],

  import: function(el, node, converter) {
    node.xmlAttributes = el.getAttributes();
    node.htmlContent = el.innerHTML;
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    el.html(node.htmlContent);
  }
};
