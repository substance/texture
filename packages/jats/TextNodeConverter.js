'use strict';

var extend = require('lodash/extend');

module.exports = {
  import: function(el, node, converter) {
    node.xmlAttributes = el.getAttributes();
    node.content = converter.annotatedText(el, [node.id, 'content']);
  },
  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    el.append(converter.annotatedText([node.id, 'content']));
  },
  // used by text node converters to reduce code redundancy
  extend: function(converter) {
    return extend({}, this, converter);
  }
};
