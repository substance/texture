import { documentHelpers } from 'substance'
import ModelFactory from './NodeModelFactory'

export default class AbstractAPI {
  getModelById (id) {
    let node = this._getDocument().get(id)
    if (node) {
      return this._getModelForNode(node)
    }
  }

  _getDocument () {
    throw new Error('This method is abstract')
  }

  _getDocumentSession () {
    throw new Error('This method is abstract')
  }

  _getValue (path) {
    return this._getDocument().get(path)
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

  // EXPERIMENTAL: want to be able to retrieve a higher-level API
  // This can be overridden to provide some context specific API,
  // e.g. such as a TableAPI.
  _getEditorAPI (context) {
    throw new Error('This method is abstract')
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
      let children = tx.get(path)
      tx.update(path, {type: 'insert', pos: children.length, value: node.id})
      tx.setSelection(_customSelection(path))
    })
    return this._getModelForNode(node)
  }

  _removeChild (path, child) {
    let node
    this._getDocumentSession().transaction((tx) => {
      node = tx.delete(child.id)
      let children = tx.get(path)
      let idx = children.indexOf(child.id)
      if (idx > -1) {
        tx.update(path, {type: 'delete', pos: idx, value: child.id})
      }
      tx.setSelection(_customSelection(path))
    })
    return this._getModelForNode(node)
  }

  _clearFlowContent (tx, path) {
    let ids = tx.get(path)
    if (ids && ids.length > 0) {
      // first clear the content
      for (let idx = ids.length - 1; idx >= 0; idx--) {
        let id = ids[idx]
        tx.update(path, { type: 'delete', pos: idx, value: id })
        documentHelpers.deleteNode(tx, tx.get(id))
      }
    }
  }
}

function _customSelection (path) {
  return {
    type: 'custom',
    customType: 'value',
    data: {
      path,
      propertyName: path[1]
    },
    nodeId: path[0],
    surfaceId: path[0]
  }
}
