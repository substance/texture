import { last } from 'substance'

const PRESERVE_WHITESPACE = {
  'preformat': true,
  'code': true
}

export default function pruneText(el, xmlSchema) {
  if (el.isElementNode()) {
    let schema = xmlSchema.getElementSchema(el.tagName)
    if (!schema.isTextAllowed()) {
      _pruneText(el, xmlSchema)
    } else if (schema.type === 'text' && !PRESERVE_WHITESPACE[el.tagName]) {
      _pruneWhiteSpace(el, xmlSchema)
    }
  }
}

function _pruneText(el, xmlSchema) {
  let childNodes = el.childNodes
  for (let i = childNodes.length - 1; i >= 0; i--) {
    let child = childNodes[i]
    if (child.isTextNode()) {
      el.removeChild(child)
    } else if (child.isElementNode()) {
      pruneText(child, xmlSchema)
    }
  }
}

function _pruneWhiteSpace(el, xmlSchema) {
  // TODO:
  // - remove all leading ws
  // - replace all inner ws with one space
  // - remove all trailing ws
  let childNodes = el.childNodes
  if (childNodes.length === 0) return
  let firstChild = childNodes[0]
  let lastChild = last(childNodes)
  // trim leading ws
  if (firstChild.isTextNode()) {
    let text = firstChild.textContent
    text = text.replace(/^\s+/g, '')
    firstChild.textContent = text
  }
  // trim trailing ws
  if (lastChild.isTextNode()) {
    let text = lastChild.textContent
    text = text.replace(/\s+$/g, '')
    lastChild.textContent = text
  }
  for (let i = 0; i < childNodes.length; i++) {
    let child = childNodes[i]
    if (child.isTextNode()) {
      let text = child.textContent
      let m
      while ( (m = /\s\s+/g.exec(text)) ) {
        const L = m[0].length
        text = text.slice(0, m.index) + ' ' + text.slice(m.index+L)
      }
      child.textContent = text
    } else if (child.isElementNode()) {
      let schema = xmlSchema.getElementSchema(child.tagName)
      if (schema.type === 'annotation') {
        _pruneWhiteSpace(child, xmlSchema)
      }
    }
  }

}
