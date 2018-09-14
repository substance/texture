export function stopEvent (e) {
  e.stopPropagation()
}

export function stopAndPreventEvent (e) {
  stopEvent(e)
  e.preventDefault()
}
