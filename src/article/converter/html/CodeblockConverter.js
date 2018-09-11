export default {
  type: 'code',
  tagName: 'pre',
  import (el, node, converter) {
    let codeEl = el.find('code')
    if (codeEl) {
      node.content = converter.annotatedText(codeEl, [node.id, 'content'], { preserveWhitespace: true })
    }
  },
  export (node, el, converter) {
    let $$ = converter.$$
    el.append(
      $$('code').append(
        converter.annotatedText([node.id, 'content'])
      )
    )
  }
}
