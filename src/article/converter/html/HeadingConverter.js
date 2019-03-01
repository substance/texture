export default {
  type: 'heading',

  matchElement (el) {
    return /^h\d$/.exec(el.tagName)
  },

  import (el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content'], { preserveWhitespace: true })
  },

  export (node, el, converter) {
    el.tagName = `h${node.level}`
    el.append(converter.annotatedText([node.id, 'content']))
  }
}
