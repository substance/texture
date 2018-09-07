import { last } from 'substance'
import { findChild } from '../util/domHelpers'

export default class BodyConverter {
  get type () { return 'body' }

  get tagName () { return 'body' }

  import (el, node, importer) {
    let children = el.getChildren()
    let flattened = []
    for (let child of children) {
      if (child.tagName === 'sec') {
        flattened = flattened.concat(this._flattenSec(child, 1))
      } else {
        flattened.push(child)
      }
    }
    node._childNodes = flattened.map(el => importer.convertElement(el).id)
  }

  _flattenSec (sec, level) {
    let result = []

    let h = sec.createElement('heading')
    // Note: mapping the section id
    // TODO: what about other attributes?
    h.attr({
      id: sec.attr('id'),
      level
    })
    // ATTENTION: <sec-meta> is not supported
    if (findChild(sec, 'sec-meta')) {
      console.error('<sec-meta> is not supported by <heading> right now.')
    }
    // mapping sec > label to heading[label]
    // TODO: is this really the way we want to do it?
    let label = findChild(sec, 'label')
    if (label) {
      h.attr('label', label.textContent)
      label.remove()
    }
    // The title is essentially the h
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
        result = result.concat(this._flattenSec(child, level + 1))
      } else {
        result.push(child)
      }
    }

    return result
  }

  export (node, el, exporter) {
    let $$ = el.createElement.bind(el)
    const children = node.getChildren()
    let stack = [{ el }]
    for (let child of children) {
      if (child.type === 'heading') {
        let heading = child
        let level = heading.getLevel()
        while (stack.length >= level + 1) {
          stack.pop()
        }
        let sec = $$('sec').attr({ id: heading.id })
        let title = $$('title')
        title.innerHTML = exporter.annotatedText(heading.getPath())
        sec.appendChild(title)
        last(stack).el.appendChild(sec)
        stack.push({ el: sec })
      } else {
        last(stack).el.appendChild(
          exporter.convertNode(child)
        )
      }
    }
  }

  static instance () {
    if (!this._instance) {
      this._instance = new BodyConverter()
    }
    return this._instance
  }
}
