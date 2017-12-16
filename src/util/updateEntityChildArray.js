export default function updateEntityChildArray(editorSession, nodeId, tagName, attribute, oldEntityIds, newEntityIds) {

  editorSession.transaction(tx => {
    let node = tx.get(nodeId)

    // TODO: do we still want to calculate the difference here?
    // if so we should keep in mind drag and drop resorting case

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
