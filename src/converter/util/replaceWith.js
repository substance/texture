export default function replaceWith(el, els) {
  const parent = el.parentNode
  const next = el.nextSibling
  els.forEach(_el => parent.insertBefore(_el, next))
  el.remove()
}
