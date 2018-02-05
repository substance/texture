import { DomUtils } from 'substance'

export function replaceWith(el, els) {
  const parent = el.parentNode
  const next = el.nextSibling
  els.forEach(_el => parent.insertBefore(_el, next))
  el.remove()
}

export function unwrapChildren(el) {
  let parent = el.parentNode
  let children = el.children
  let L = children.length
  for (let i = 0; i < L; i++) {
    parent.insertBefore(children[i], el)
  }
  parent.removeChild(el)
}

export function findChild(el, cssSelector) {
  const children = el.getChildren()
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.is(cssSelector)) return child
  }
}

export function findAllChilds(el, cssSelector) {
  const children = el.getChildren()
  let result = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.is(cssSelector)) {
      result.push(child)
    }
  }
  return result
}


export function isMixed(el) {
  let childNodes = el.childNodes
  const L = childNodes.length
  for (var i = 0; i < L; i++) {
    const childNode = childNodes[i]
    if (childNode.isTextNode() && !/^\s*$/.exec(childNode.textContent)) {
      return true
    }
  }
  return false
}

export function printElement(el, options = {}) {
  let maxLevel = options.maxLevel || 1000
  let res = _printElement(el, 1, maxLevel)
  return res
}

function _printElement(el, level, maxLevel) {
  let INDENT = new Array(level-1)
  INDENT.fill('  ')
  INDENT = INDENT.join('')

  if (el.isElementNode()) {
    if (level <= maxLevel) {
      let res = []
      res.push(INDENT + _openTag(el))
      res = res.concat(
        el.childNodes.map((child) => {
          return _printElement(child, level+1, maxLevel)
        }).filter(Boolean)
      )
      res.push(INDENT + _closeTag(el))
      return res.join('\n')
    } else {
      return INDENT + _openTag(el)+'...'+_closeTag(el)
    }
  } else if (el.isTextNode()) {
    let textContent = el.textContent
    if (/^\s*$/.exec(textContent)) {
      return ''
    } else {
      return INDENT + JSON.stringify(el.textContent)
    }
  } else {
    // TODO: render other node types and consider maxLevel
    return INDENT + el.serialize()
  }
}

function _openTag(el) {
  let attribStr = DomUtils.formatAttribs(el)
  if (attribStr) {
    return `<${el.tagName} ${attribStr}>`
  } else {
    return `<${el.tagName}>`
  }
}

function _closeTag(el) {
  return `</${el.tagName}>`
}
