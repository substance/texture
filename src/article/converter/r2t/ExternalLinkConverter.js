export default class ExternalLinkConverter {
  get type () { return 'external-link' }
  get tagName () { return 'ext-link' }

  import (el, node) {
    let extLinkType = el.getAttribute('ext-link-type')
    if (extLinkType && extLinkType !== 'uri') {
      throw new Error('Only ext-link-type="uri" is supported.')
    }
    let href = el.getAttribute('xlink:href')
    if (href) {
      node.href = href
    }
  }
  export (node, el) {
    // ATM only 'uri' is supported, and thus hard-coded here
    el.setAttribute('ext-link-type', 'uri')
    el.setAttribute('xlink:href', node.href)
  }
}
