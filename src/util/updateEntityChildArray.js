import { without } from 'substance'

export default function updateEntityChildArray(tx, nodeId, tagName, attribute, oldEntityIds, newEntityIds) {

  let node = tx.get(nodeId)
  let addedEntityIds = without(newEntityIds, ...oldEntityIds)
  let removedEntityIds = without(oldEntityIds, ...newEntityIds)

  // Remove old entities
  removedEntityIds.forEach(entityId => {
    let entityRefNode = node.find(`${tagName}[${attribute}=${entityId}]`)
    node.removeChild(entityRefNode)
    // Remove it completely
    tx.delete(entityRefNode.id)
  })

  // Create new entities
  addedEntityIds.forEach(entityId => {
    let entityRefNode = node.find(`${tagName}[${attribute}=${entityId}]`)
    if (!entityRefNode) {
      let opts = {}
      if (attribute === 'id') {
        opts = { id: entityId }
      }
      entityRefNode = tx.createElement(tagName, opts)
      if (attribute !== 'id') {
        entityRefNode.setAttribute(attribute, entityId)
      }
    }
    node.appendChild(entityRefNode)
  })

  // Sort entities in order of newEntityIds array
  let map = {}
  let refs = tx.findAll(`${tagName}`)
  refs.forEach(ref => {
    const rid = ref.getAttribute('rid')
    map[rid] = ref
  })
  node.children.forEach(child => {
    node.removeChild(child)
  })
  newEntityIds.forEach(entityId => {
    node.appendChild(map[entityId])
  })

  tx.setSelection(null)
}
