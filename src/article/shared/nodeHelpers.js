export function getLabel (node) {
  if (node && node.state) {
    return node.state.label
  }
}

export function getPos (node) {
  let pos
  if (node && node.state) {
    pos = node.state.pos
  }
  if (pos === undefined) {
    pos = Number.MAX_VALUE
  }
  return pos
}
