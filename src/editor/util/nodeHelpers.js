export function getLabel(node) {
  if (node && node.state) {
    return node.state.label
  }
}
