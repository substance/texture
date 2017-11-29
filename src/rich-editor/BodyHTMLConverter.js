export default {

  type: 'body',
  tagName: 'body',

  import: function(el, node, converter) {
    node.id = 'body'
    node.content = converter.annotatedText(el, [node.id, 'content'])
  },

  export: function(node, el, converter) {
    el.append(converter.annotatedText([node.id, 'content']))
  }

}
