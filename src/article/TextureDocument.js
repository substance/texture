import { XMLDocument, without } from 'substance'
import InternalArticle from './InternalArticle'
import XrefIndex from './XrefIndex'
import TextureEditing from './TextureEditing'
import TextureEditingInterface from './TextureEditingInterface'

export default class TextureDocument extends XMLDocument {

  _initialize() {
    super._initialize()
    // special index for xref lookup
    this.addIndex('xrefs', new XrefIndex())
  }

  findByType(type) {
    let NodeClass = this.schema.getNodeClass(type)
    if (!NodeClass) return []
    let nodesByType = this.getIndex('type')
    let nodeIds = []
    if (NodeClass.abstract) {
      // TODO: would be nice to get sub-types from the schema
      const schema = this.schema
      schema.nodeRegistry.names.forEach((subType) => {
        if (schema.isInstanceOf(subType, type)) {
          nodeIds = nodeIds.concat(Object.keys(nodesByType.get(subType)))
        }
      })
    } else {
      nodeIds = Object.keys(nodesByType.get(type))
    }
    // HACK: we do not want to have one of these in the result
    // how could we generalise this?
    nodeIds = without(nodeIds, 'main-article')
    return nodeIds
  }

  getDocTypeParams() {
    return InternalArticle.getDocTypeParams()
  }

  getXMLSchema() {
    return InternalArticle
  }

  getRootNode() {
    return this.get('article')
  }

  getXRefs() {
    let articleEl = this.get('article')
    // this traverses the article in the same way as css-select
    return articleEl.findAll('xref')
  }

  createEditingInterface() {
    return new TextureEditingInterface(this, { editing: new TextureEditing() })
  }

  invert(change) {
    let inverted = change.invert()
    let info = inverted.info || {}
    switch(change.info.action) {
      case 'insertRows': {
        info.action = 'deleteRows'
        break
      }
      case 'deleteRows': {
        info.action = 'insertRows'
        break
      }
      case 'insertCols': {
        info.action = 'deleteCols'
        break
      }
      case 'deleteCols': {
        info.action = 'insertCols'
        break
      }
      default:
        //
    }
    inverted.info = info
    return inverted
  }
}
