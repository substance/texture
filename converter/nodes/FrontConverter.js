'use strict';

var map = require('lodash/map');
var Front = require('../../model/nodes/Front');

module.exports = {

  type: 'front',
  tagName: 'front',

  allowedContext: Front.static.allowedContext,

  import: function(el, node, converter) {
    node.id = this.tagName;
    node.nodes = map(el.getChildNodes(), function(childEl) {
      var child = converter.convertElement(childEl);
      return child.id;
    });
  },

  export: function(node, el, converter) {
    el.append(converter.convertContainer(node));
  }

};
