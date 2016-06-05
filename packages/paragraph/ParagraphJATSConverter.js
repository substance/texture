'use strict';

module.exports = {

  type: 'paragraph',
  tagName: 'p',

  import: function(el, node, converter) {
    node.xmlAttributes = el.getAttributes();
    node.content = converter.annotatedText(el, [node.id, 'content']);
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    el.append(converter.annotatedText([node.id, 'content']));
  }

};
