import ModelFactory from './NodeModelFactory'

export default class AbstractAPI {
  _getDocument () {
    throw new Error('This method is abstract')
  }

  _getDocumentSession () {
    throw new Error('This method is abstract')
  }

  _getValue (path) {
    return this._getDocument().get(path)
  }

  _getModelById (id) {
    let node = this._getDocument().get(id)
    if (node) {
      return this._getModelForNode(node)
    }
  }

  _getModelForNode (node) {
    return ModelFactory.create(this, node)
  }

  // TODO: rethink. this should come from some configuration
  // Note: we do not want to use the node schema here, because
  // we want to treat violations in a soft manner
  // _isPropertyRequired (type, propertyName) {
  //   let REQUIRED = REQUIRED_PROPERTIES[type]
  //   if (REQUIRED) return REQUIRED.has(propertyName)
  //   return false
  // }
  _isPropertyRequired (type, propertyName) { // eslint-disable-line
    return false
  }

  _setValue (path, value) {
    this._getDocumentSession().transaction(tx => {
      tx.set(path, value)
      tx.setSelection(_customSelection(path))
    })
  }

  _toggleRelationship (path, id) {
    this._getDocumentSession().transaction(tx => {
      let ids = tx.get(path)
      let idx = ids.indexOf(id)
      if (idx === -1) {
        tx.update(path, {type: 'insert', pos: ids.length, value: id})
      } else {
        tx.update(path, {type: 'delete', pos: idx, value: id})
      }
      tx.setSelection(_customSelection(path))
    })
  }

  _addModel (data) {
    let node
    this._getDocumentSession().transaction(tx => {
      node = tx.create(data)
      // TODO: it would be good to set the selection here
      // e.g. to the first text property
      tx.setSelection(null)
    })
    return this._getModelForNode(node)
  }

  _removeModel (model) {
    let node
    this._getDocumentSession().transaction((tx) => {
      node = tx.delete(model.id)
      tx.setSelection(null)
    })
    return this._getModelForNode(node)
  }

  _appendChild (path, child) {
    let node
    this._getDocumentSession().transaction((tx) => {
      node = tx.create(child)
      let ids = tx.get(path)
      tx.update(path, {type: 'insert', pos: ids.length, value: node.id})
      tx.setSelection(_customSelection(path))
    })
    return this._getModelForNode(node)
  }
}

function _customSelection (path) {
  return {
    type: 'custom',
    customType: 'value',
    data: {
      propertyName: path[1]
    },
    surfaceId: path[0]
  }
}
