export default {
  type: 'paragraph',
  tagName: 'p',
  import (el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content'])
  },
  export (node, el, converter) {
    el.append(converter.annotatedText([node.id, 'content']))
  }
}
