'use strict';

var map = require('lodash/map');
var Body = require('../../model/nodes/Body');

module.exports = {

  type: 'body',
  tagName: 'body',

  allowedContext: Body.static.allowedContext,

  import: function(el, node, converter) {
    var state = converter.state;
    node.id = this.tagName;
    state.pushContainer(node);
    node.nodes = map(el.getChildNodes(), function(childEl) {
      var child = converter.convertElement(childEl);
      return child.id;
    });
    state.popContainer(node);
  },

  export: function(node, el, converter) {
    el.append(converter.convertContainer(node));
  }

};
