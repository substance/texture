import { XMLDocument } from 'substance'
import ManifestSchema from './ManifestSchema'

export default class ManifestDocument extends XMLDocument {

  /**
   * Adds a document entry to the manifest
   * @param {Object} rawDocumentEntry The raw version of the document entry to be added to the manifest
   */
  addDocumentEntry(rawDocumentEntry) {
    this.find('documents').append(
        this.createElement('document').attr(rawDocumentEntry)
    )
  }

  getRootNode() {
    if (!this.root) {
      let nodes = this.getNodes()
      let ids = Object.keys(nodes)
      for (var i = 0; i < ids.length; i++) {
        let node = nodes[ids[i]]
        if (node.type === 'dar') {
          this.root = node
        }
      }
    }
    return this.root
  }

  getDocTypeParams() {
    return ManifestSchema.getDocTypeParams()
  }

  getXMLSchema() {
    return ManifestSchema
  }

  getDocumentNodes() {
    return this.findAll('documents > document')
  }

  getAssetNodes() {
    return this.findAll('assets > asset')
  }

  getDocumentEntries() {
    let documents = this.findAll('documents > document')
    return documents.map(_getEntryFromDocumentNode)
  }

  getDocumentEntry(id) {
    let entryNode = this.get(id)
    if (entryNode && entryNode.type === 'document') {
      return _getEntryFromDocumentNode(entryNode)
    }
  }

}

function _getEntryFromDocumentNode(documentNode) {
  return Object.assign({ id: documentNode.id }, documentNode.getAttributes())
}
