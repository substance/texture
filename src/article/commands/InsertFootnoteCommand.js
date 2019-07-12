import { findParentByType } from '../shared/nodeHelpers'
import AddEntityCommand from './AddEntityCommand'

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

  execute (params, context) {
    let footnoteCollectionPath = this._getCollectionPath(params, context)
    context.api.addFootnote(footnoteCollectionPath)
  }
}
