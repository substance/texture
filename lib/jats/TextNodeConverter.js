import extend from 'lodash/extend'

export default {
  import: function(el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content'])
  },
  export: function(node, el, converter) {
    el.append(converter.annotatedText([node.id, 'content']))
  },
  // used by text node converters to reduce code redundancy
  extend: function(converter) {
    return extend({}, this, converter)
  }
}
