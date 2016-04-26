'use strict';

module.exports = {

  type: 'table', // Substance node model
  tagName: 'table', // Used as a matcher

  allowedContext: [
    'table-wrap'
  ],

  import: function(el, node, converter) {
    // jshint unused:false
    node.xmlAttributes = el.getAttributes();
    node.htmlContent = el.innerHTML;
  },

  export: function(node, el, converter) {
    // jshint unused:false
    el.attr(node.xmlAttributes);
    el.html(node.htmlContent);
  }
};
