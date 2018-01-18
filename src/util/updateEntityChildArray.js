export default function updateEntityChildArray(editorSession, nodeId, tagName, attribute, oldEntityIds, newEntityIds) {

  editorSession.transaction(tx => {
    let node = tx.get(nodeId)

    // Originally we had this code to compute a delta and make the most minimal
    // update.
    //
    // let addedEntityIds = without(newEntityIds, ...oldEntityIds)
    // let removedEntityIds = without(oldEntityIds, ...newEntityIds)
    //
    // However with the need for resorting we had to disable this
    // TODO: find a more efficient solution.

    // Remove old entities
    oldEntityIds.forEach(entityId => {
      let entityRefNode = node.find(`${tagName}[${attribute}=${entityId}]`)
      node.removeChild(entityRefNode)
      // Remove it completely
      tx.delete(entityRefNode.id)
    })

    // Create new entities
    newEntityIds.forEach(entityId => {
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
    tx.setSelection(null)
  })
}
