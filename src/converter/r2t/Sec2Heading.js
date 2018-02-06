import { last } from 'substance'
import { replaceWith, findChild } from '../util/domHelpers'

export default class Sec2Heading {

  import(dom) {
    // find all top-level sections
    let topLevelSecs = dom.findAll('sec').filter(sec => sec.parentNode.tagName !== 'sec')
    topLevelSecs.forEach((sec) => {
      replaceWith(sec, _flattenSec(sec, 1))
    })
  }

  export(dom) {
    let allHeadings = dom.findAll('heading')
    let containers = []
    allHeadings.forEach((heading)=> {
      let container = heading.parentNode
      if (!container._sec2heading) {
        containers.push(container)
        container._sec2heading = true
      }
    })
    containers.forEach((container) => {
      _createSections(container)
    })
  }

}

function _flattenSec(sec, level) {
  let result = []

  let h = sec.createElement('heading')
  h.attr(sec.getAttributes())
  h.attr('level', level)

  // move the section front matter
  if(sec.find('sec-meta')) {
    console.error('<sec-meta> is not supported by <heading> right now.')
  }
  let label = sec.find('label')
  if (label) {
    h.attr('label', label.textContent)
    label.remove()
  }
  let title = findChild(sec, 'title')
  if (title) {
    h.append(title.childNodes)
    title.remove()
  }

  result.push(h)

  // process the remaining content recursively
  let children = sec.children
  let L = children.length
  for (let i = 0; i < L; i++) {
    const child = children[i]
    if (child.tagName === 'sec') {
      result = result.concat(_flattenSec(child, level+1))
    } else {
      result.push(child)
    }
  }

  return result
}

function _createSections(container) {
  const doc = container.getOwnerDocument()
  const children = container.children
  // clear the container first
  container.empty()
  let stack = [{
    el: container
  }]
  for (let i=0; i < children.length; i++) {
    let child = children[i]
    if (child.tagName === 'heading') {
      let heading = child
      let level = parseInt(child.attr('level') || "1")
      while (stack.length >= level+1) {
        stack.pop()
      }
      let sec = doc.createElement('sec')
      // copy all attributes from the heading to the section element
      let attributes = {}
      child.getAttributes().forEach((val, key) => {
        if (key !== 'level') {
          attributes[key] = val
        }
      })
      sec.attr(attributes)
      let title = doc.createElement('title')
      title.innerHTML = heading.innerHTML
      sec.appendChild(title)
      last(stack).el.appendChild(sec)
      stack.push({
        el: sec
      })
    } else {
      last(stack).el.appendChild(child)
    }
  }
}
