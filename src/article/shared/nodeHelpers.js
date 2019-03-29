export function getLabel (node) {
  if (node._isModel) {
    node = node._node
  }
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

export function ifNodeOrRelatedHasChanged (node, change, cb) {
  let doc = node.getDocument()
  let id = node.id
  let hasChanged = change.hasUpdated(id)
  if (!hasChanged) {
    let relationships = doc.getIndex('relationships')
    // TODO: this could probably be improved by only navigating updated nodes
    let ids = Object.keys(change.updated)
    for (let _id of ids) {
      let related = relationships.get(_id)
      if (related && related.has(id)) {
        hasChanged = true
        break
      }
    }
  }
  if (hasChanged) cb()
}
