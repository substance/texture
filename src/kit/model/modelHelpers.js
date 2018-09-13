export function isFlowContentEmpty (api, path) {
  let ids = api._getValue(path)
  if (ids.length === 0) return true
  // otherwise considered only empty if container has only one empty child node
  if (ids > 1) return false
  let first = api.getModelById(ids[0])
  // being robust agains broken refs
  if (first && first.isEmpty) {
    return first.isEmpty()
  }
}
