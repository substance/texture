export function isCollectionEmpty (api, path) {
  let doc = api.getDocument()
  let ids = doc.get(path)
  if (ids.length === 0) return true
  // otherwise considered only empty if container has only one empty child node
  if (ids > 1) return false
  let first = doc.get(ids[0])
  // being robust against invalid ids
  if (first && first.isEmpty) {
    return first.isEmpty()
  }
}
