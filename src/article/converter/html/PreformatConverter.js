export default {
  type: 'preformat',
  tagName: 'pre',
  import (el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content'], { preserveWhitespace: true })
  },
  export (node, el, converter) {
    el.append(
      converter.annotatedText([node.id, 'content'])
    )
  }
}
