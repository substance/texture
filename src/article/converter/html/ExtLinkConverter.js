export default {
  type: 'external-link',
  tagName: 'a',
  import (el, node) {
    let href = el.getAttribute('href')
    if (href) {
      node.href = href
    }
  },
  export (node, el) {
    el.setAttribute('href', node.href)
  }
}
