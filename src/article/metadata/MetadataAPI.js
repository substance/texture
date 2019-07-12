import ArticleAPI from '../api/ArticleAPI'

export default class MetadataAPI extends ArticleAPI {
  selectCard (nodeId) {
    this._setSelection(this._createCardSelection(nodeId))
  }

  _createEntitySelection (node) {
    return this._selectFirstRequiredPropertyOfMetadataCard(node)
  }

  _createCardSelection (nodeId) {
    return {
      type: 'custom',
      customType: 'card',
      nodeId
    }
  }

  // ATTENTION: this only works for meta-data cards, thus the special naming
  _selectFirstRequiredPropertyOfMetadataCard (node) {
    let prop = this._getFirstRequiredProperty(node)
    if (prop) {
      if (prop.isText() || prop.type === 'string') {
        let path = [node.id, prop.name]
        return {
          type: 'property',
          path,
          startOffset: 0,
          surfaceId: this._getSurfaceId(node, prop.name, 'metadata')
        }
      } else if (prop.isContainer()) {
        let nodes = node.resolve(prop.name)
        let first = nodes[0]
        if (first && first.isText()) {
          let path = first.getPath()
          return {
            type: 'property',
            path,
            startOffset: 0,
            surfaceId: this._getSurfaceId(node, prop.name, 'metadata')
          }
        }
      } else {
        console.error('FIXME: set the cursor into a property of unsupported type')
      }
    }
    // otherwise fall back to 'card' selection
    return this._createCardSelection(node.id)
  }
}
