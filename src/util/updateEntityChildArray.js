import { without } from 'substance'

export default function updateEntityChildArray(editorSession, nodeId, tagName, attribute, oldEntityIds, newEntityIds) {

  editorSession.transaction(tx => {
    let node = tx.get(nodeId)

    let addedEntityIds = without(newEntityIds, ...oldEntityIds)
    let removedEntityIds = without(oldEntityIds, ...newEntityIds)

    // Remove removedEntities
    removedEntityIds.forEach(entityId => {
      let entityRefNode = node.find(`${tagName}[${attribute}=${entityId}]`)
      node.removeChild(entityRefNode)
      // Remove it completely
      tx.delete(entityRefNode.id)
    })
    // Create addedEntities
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
  })
}
