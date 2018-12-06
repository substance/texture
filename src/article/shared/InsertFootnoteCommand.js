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
      const parentTable = findParentByType(node, 'table-figure')
      const tableModel = context.api.getModelById(parentTable.id)
      return tableModel.getFootnotes()
    }
  }
}
