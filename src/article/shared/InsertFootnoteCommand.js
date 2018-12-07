import { findParentByType } from './nodeHelpers'
// TODO: move AddEntityCommand into shared
import AddEntityCommand from '../metadata/AddEntityCommand'

export default class InsertFootnoteCommand extends AddEntityCommand {
  detectScope (params) {
    const xpath = params.selectionState.xpath
    return xpath.indexOf('table-figure') > -1 ? 'table-figure' : 'default'
  }

  _getCollection (params, context) {
    const scope = this.detectScope(params)
    if (scope === 'default') {
      const collectionName = 'footnotes'
      return context.api.getModelById(collectionName)
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
      const tableModel = context.api.getModelById(tableNodeId)
      return tableModel.getFootnotes()
    }
  }
}
