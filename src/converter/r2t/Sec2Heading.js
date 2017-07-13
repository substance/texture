import { replaceWith } from '../util/domHelpers'

export default class Sec2Heading {

  import(dom) {
    // find all top-level sections
    let topLevelSecs = dom.findAll('sec').filter(sec => sec.parentNode.tagName !== 'sec')
    topLevelSecs.forEach((sec) => {
      replaceWith(sec, _flattenSec(sec, 1))
    })
  }

  export(dom) {
    console.error('TODO: implement Sec2Heading.export()', dom)
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
  let title = sec.find('title')
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
