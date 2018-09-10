export default {
  type: 'ext-link',
  tagName: 'a',
  import (el, node) {
    let href = el.getAttribute('href')
    if (href) {
      node.attributes = {
        'xlink:href': href
      }
    }
  },
  export (node, el) {
    el.setAttribute('href', node.attributes['xlink:href'])
  }
}
