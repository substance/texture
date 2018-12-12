import { Command } from 'substance'
import { findParentByType } from './nodeHelpers'

export default class AddFigurePanelCommand extends Command {
  getCommandState (params, context) {
    return {
      disabled: this.isDisabled(params)
    }
  }

  execute (params, context) {
    const collection = this._getCollection(params, context)
    const files = params.files
    let api = context.api
    if (files.length > 0) {
      api._insertFigurePanel(files, collection)
    }
  }

  isDisabled (params) {
    const xpath = params.selectionState.xpath
    return xpath.indexOf('figure') === -1
  }

  _getCollection (params, context) {
    const api = context.api
    const sel = params.selection
    const doc = params.editorSession.getDocument()
    let nodeId = sel.getNodeId()
    const selectedNode = doc.get(nodeId)
    if (selectedNode.type !== 'figure') {
      const node = findParentByType(selectedNode, 'figure')
      nodeId = node.id
    }
    const figureModel = api.getModelById(nodeId)    
    return figureModel.getPanels()
  }
}
