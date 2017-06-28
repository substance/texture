export function replaceWith(el, els) {
  const parent = el.parentNode
  const next = el.nextSibling
  els.forEach(_el => parent.insertBefore(_el, next))
  el.remove()
}

export function unwrapChildren(el) {
  let parent = el.parentNode
  let next = el.nextSibling
  let children = el.children
  let L = children.length
  for (let i = 0; i < L; i++) {
    parent.insertBefore(children[i], next)
  }
}

export function findChild(el, cssSelector) {
  const children = el.getChildren()
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.is(cssSelector)) return child
  }
}
