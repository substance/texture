// These converters are used for the Clipboard
// Only basic formatting needs to be considered
export default [
  {
    type: 'p',
    tagName: 'p',
    import(el, node, converter) {
      node.content = converter.annotatedText(el, [node.id, 'content'])
    },
    export(node, el, converter) {
      el.append(converter.annotatedText([node.id, 'content']))
    }
  },
  {
    type: 'bold',
    tagName: 'b',
    matchElement(el) {
      return (el.is('b')) ||
        // To support non-semantic formatting, like GDocs does
        // ATTENTION: GDocs packs all formatting into one span using style attributes.
        // We only map to one node
        (el.is('span') && el.getStyle('font-weight') === '700')
    }
  },
  {
    type: 'italic',
    tagName: 'i',
    matchElement(el) {
      return (el.is('i')) ||
        (el.is('span') && el.getStyle('font-style') === 'italic')
    }
  },
  {
    type: 'underline',
    tagName: 'span',
    matchElement(el) {
      return el.getStyle('text-decoration') === 'underline'
    },
    export(node, el) {
      el.setStyle('text-decoration', 'underline')
    }
  },
  {
    type: 'strike',
    tagName: 'span',
    matchElement(el) {
      return el.getStyle('text-decoration') === 'line-through'
    },
    export(node, el) {
      el.setStyle('text-decoration', 'line-through')
    }
  },
  {
    type: 'sub',
    tagName: 'sub',
    matchElement(el) {
      return (el.is('sub')) || (el.is('span') && el.getStyle('vertical-align') === 'sub')
    }
  },
  {
    type: 'sup',
    tagName: 'sup',
    matchElement(el) {
      return (el.is('sup')) || (el.is('span') && el.getStyle('vertical-align') === 'super')
    },
    // export(node, el, converter) {
    //   el.tagName = 'span'
    //   el.setStyle('vertical-align', 'super')
    // }
  },
  {
    type: 'ext-link',
    tagName: 'a',
    import(el, node) {
      let href = el.getAttribute('href')
      if (href) {
        node.attributes = {
          'xlink:href': href
        }
      }
    },
    export(node, el) {
      el.setAttribute('href', node.attributes['xlink:href'])
    }
  }
]
