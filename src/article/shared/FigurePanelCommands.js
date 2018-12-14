import { Command } from 'substance'
import { findParentByType } from './nodeHelpers'

class BasicFigurePanelCommand extends Command {
  getCommandState (params, context) {
    return {
      disabled: this.isDisabled(params, context)
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
}

export class AddFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const figureModel = this._getFigureModel(params, context)
    const files = params.files
    if (files.length > 0) {
      figureModel.addPanel(files[0])
    }
  }
}

export class RemoveFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const figureModel = this._getFigureModel(params, context)
    figureModel.removePanel()
  }

  isDisabled (params, context) {
    const xpath = params.selectionState.xpath
    if (xpath.indexOf('figure') > -1) {
      const figureModel = this._getFigureModel(params, context)
      const panelsLength = figureModel.getPanelsLength()
      if (panelsLength > 1) {
        return false
      }
    }
    return true
  }
}

export class MoveFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const direction = this.config.direction
    const figureModel = this._getFigureModel(params, context)
    if (direction === 'up') {
      figureModel.movePanelUp()
    } else if (direction === 'down') {
      figureModel.movePanelDown()
    }
  }
  isDisabled (params, context) {
    const xpath = params.selectionState.xpath
    if (xpath.indexOf('figure') > -1) {
      const figureModel = this._getFigureModel(params, context)
      const currentIndex = figureModel.getCurrentPanelIndex()
      const panelsLength = figureModel.getPanelsLength()
      const direction = this.config.direction
      if (panelsLength > 1) {
        if ((direction === 'up' && currentIndex > 0) || (direction === 'down' && currentIndex < panelsLength - 1)) {
          return false
        }
      }
    }
    return true
  }
}
