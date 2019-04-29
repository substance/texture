export default class ExternalLinkConverter {
  get type () { return 'external-link' }
  get tagName () { return 'ext-link' }

  import (el, node) {
    let extLinkType = el.getAttribute('ext-link-type')
    if (extLinkType) {
      node.linkType = extLinkType
    }
    let href = el.getAttribute('xlink:href')
    if (href) {
      node.href = href
    }
  }
  export (node, el) {
    if (node.linkType) {
      el.setAttribute('ext-link-type', node.linkType)
    }
    if (node.href) {
      el.setAttribute('xlink:href', node.href)
    }
  }
}
