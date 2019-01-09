export default class GraphicConverter {
  get type () { return 'graphic' }

  get tagName () { return 'graphic' }

  import (el, node) {
    node.mimeType = [el.attr('mimetype'), el.attr('mime-subtype')].join('/')
    node.href = el.attr('xlink:href')
  }

  export (node, el) {
    let mimeData = node.mimeType.split('/')
    el.attr('mimetype', mimeData[0])
    el.attr('mime-subtype', mimeData[1])
    el.attr('xlink:href', node.href)
  }
}
