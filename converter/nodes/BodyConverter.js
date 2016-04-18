'use strict';

var map = require('lodash/map');

module.exports = {

  type: 'body',
  tagName: 'body',

  allowedContext: 'article',

  import: function(el, node, converter) {
    node.nodes = map(el.getChildNodes(), function(childEl) {
      var child = converter.convertElement(childEl);
      return child.id;
    });
  },

  export: function(node, el, converter) {
    el.append(converter.convertContainer(node));
  }

};
