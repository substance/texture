export default {
  type: 'preformat',
  tagName: 'preformat',
  import (el, node, converter) {
    let preformatEl = el.find('preformat')
    if (preformatEl) {
      node.content = converter.annotatedText(preformatEl, [node.id, 'content'], { preserveWhitespace: true })
    }
  },
  export (node, el, converter) {
    let $$ = converter.$$
    el.append(
      $$('preformat').append(
        converter.annotatedText([node.id, 'content'])
      )
    )
  }
}
