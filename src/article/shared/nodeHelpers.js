export function getLabel (node) {
  let label = node.label
  if (node && node.state) {
    label = node.state.label || label
  }
  return label
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

export function findParentByType (node, type) {
  let parent = node.getParent()
  while (parent) {
    if (parent.isInstanceOf(type)) {
      return parent
    }
    parent = parent.getParent()
  }
}
