/*
  A model for annotated text (e.g. <article-title>)
*/
export default class DefaultModel {
  constructor(node, context) {
    this._node = node
    this.context = context
  }

  get id() {
    return this._node.id
  }

  get type() {
    return this._node.type
  }

  getNode() {
    return this._node
  }

  /*
    Internal method for adding an entity of certain type
  */
  _addEntity(data, type) {
    const newNode = Object.assign({}, data, {
      type: type
    })
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.create(newNode)
    })
    return node.id
  }

  /*
    Internal method for adding an entity of certain type
  */
  _getEntity(nodeId) {
    const pubMetaDb = this.context.pubMetaDb
    const node = pubMetaDb.get(nodeId)
    if(!node) {
      console.error(`Entity with id ${nodeId} not found`)
      return
    }
    return node.toJSON()
  }

  /*
    Internal method for updating a certain entity
  */
  _updateEntity(nodeId, data) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    pubMetaDbSession.transaction((tx) => {
      tx.updateNode(nodeId, data)
    })
    return this._getEntity(nodeId)
  }

  /*
    Internal method for removing a certain entity
  */
  _deleteEntity(nodeId) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.delete(nodeId)
    })
    return node
  }
}