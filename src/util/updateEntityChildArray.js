import { without } from 'substance'

export default function updateEntityChildArray(editorSession, nodeId, tagName, attribute, oldEntityIds, newEntityIds) {

  editorSession.transaction(tx => {
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

    // TODO: Now, sort elements according to newEntityIds order
    // 1) create mapping table for all ref-nodes entityId -> refNode
    //     map = {'entity-12': <ref id="r1" rid="entity-12"/>}
    // 2) node.empty()
    // 3) iterate through newEntityIds and do node.append(map[entityId])
    console.warn('TODO: implement sorting')
    tx.setSelection(null)
  })
}
