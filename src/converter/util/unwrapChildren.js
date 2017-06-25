export default function unwrapChildren(el) {
  let parent = el.parentNode
  let next = el.nextSibling
  let children = el.children
  let L = children.length
  for (let i = 0; i < L; i++) {
    parent.insertBefore(children[i], next)
  }
}