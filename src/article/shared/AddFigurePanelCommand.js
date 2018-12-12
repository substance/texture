import { Command } from 'substance'
import { findParentByType } from './nodeHelpers'

export default class AddFigurePanelCommand extends Command {
  getCommandState (params, context) {
    return {
      disabled: this.isDisabled(params)
    }
  }

  execute (params, context) {
    const figureModel = this._getFigureModel(params, context)
    const panels = figureModel.getPanels()
    const index = this._getCurrentPanelIndex(figureModel)
    const files = params.files
    let api = context.api
    if (files.length > 0) {
      api._insertFigurePanel(files[0], panels, index)
    }
  }

  isDisabled (params) {
    const xpath = params.selectionState.xpath
    return xpath.indexOf('figure') === -1
  }

  _getFigureModel (params, context) {
    const api = context.api
    const sel = params.selection
    const doc = params.editorSession.getDocument()
    let nodeId = sel.getNodeId()
    const selectedNode = doc.get(nodeId)
    if (selectedNode.type !== 'figure') {
      const node = findParentByType(selectedNode, 'figure')
      nodeId = node.id
    }
    return api.getModelById(nodeId)
  }

  _getCurrentPanelIndex (figureModel) {
    const node = figureModel._node
    let currentPanelIndex = 0
    if (node.state) {
      currentPanelIndex = node.state.currentPanelIndex
    }
    return currentPanelIndex
  }
}
