import { documentHelpers } from 'substance'
import { findParentByType } from './nodeHelpers'
import AddEntityCommand from './AddEntityCommand'
import Footnote from '../models/Footnote'

export default class InsertFootnoteCommand extends AddEntityCommand {
  detectScope (params) {
    const xpath = params.selectionState.xpath
    return xpath.find(n => n.type === 'table-figure') ? 'table-figure' : 'default'
  }

  _getCollectionPath (params, context) {
    const scope = this.detectScope(params)
    if (scope === 'default') {
      return ['article', 'footnotes']
    } else {
      const doc = params.editorSession.getDocument()
      const nodeId = params.selection.getNodeId()
      const node = doc.get(nodeId)
      let tableNodeId = node.id
      // check if we are already selected table-figure
      if (node.type !== 'table-figure') {
        const parentTable = findParentByType(node, 'table-figure')
        tableNodeId = parentTable.id
      }
      return [tableNodeId, 'footnotes']
    }
  }

  _addItemToCollection (params, context) {
    let collectionPath = this._getCollectionPath(params, context)
    context.editorSession.transaction(tx => {
      let node = documentHelpers.createNodeFromJson(tx, Footnote.getTemplate())
      documentHelpers.append(tx, collectionPath, node.id)
      let p = tx.get(node.content[0])
      tx.setSelection({
        type: 'property',
        path: p.getPath(),
        startOffset: 0,
        // TODO: adapt ArticleAPI._getSurfaceId()
        surfaceId: `${node.id}.content`,
        containerPath: [node.id, 'content']
      })
    })
  }
}
