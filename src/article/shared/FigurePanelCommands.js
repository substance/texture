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
    return !xpath.find(n => n.type === 'figure')
  }

  _getFigure (params, context) {
    const sel = params.selection
    const doc = params.editorSession.getDocument()
    let nodeId = sel.getNodeId()
    const selectedNode = doc.get(nodeId)
    if (selectedNode.type !== 'figure') {
      const node = findParentByType(selectedNode, 'figure')
      nodeId = node.id
    }
    return doc.get(nodeId)
  }

  _getFigurePanel (params, context) {
    const figure = this._getFigure(params, context)
    const currentIndex = figure.getCurrentPanelIndex()
    const doc = figure.getDocument()
    return doc.get(figure.panels[currentIndex])
  }

  _matchSelection (params, context) {
    const xpath = params.selectionState.xpath
    const isInFigure = xpath.find(n => n.type === 'figure')
    return isInFigure
  }
}

export class AddFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const files = params.files
    // TODO: why only one file? we could also add multiple panels at once
    if (files.length > 0) {
      const file = files[0]
      const figure = this._getFigure(params, context)
      context.api._addFigurePanel(figure.id, file)
    }
  }
}

export class ReplaceFigurePanelImageCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const figurePanel = this._getFigurePanel(params, context)
    const files = params.files
    if (files.length > 0) {
      let graphic = figurePanel.getContent()
      context.api._replaceFile([graphic.id, 'href'], files[0])
    }
  }

  isDisabled (params, context) {
    const matchSelection = this._matchSelection(params, context)
    if (matchSelection) return false
    return true
  }
}

export class RemoveFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const api = context.api
    const figure = this._getFigure(params, context)
    const figurePanel = this._getFigurePanel(params, context)
    // TODO: this shows that generic API does not work without additional steps
    api._deleteChild([figure.id, 'panels'], figurePanel, tx => {
      tx.selection = null
    })
  }

  isDisabled (params, context) {
    const matchSelection = this._matchSelection(params, context)
    if (matchSelection) {
      const figure = this._getFigure(params, context)
      if (figure.panels.length > 1) {
        return false
      }
    }
    return true
  }
}

export class MoveFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const direction = this.config.direction
    const figure = this._getFigure(params, context)
    const figurePanel = this._getFigurePanel(params, context)
    const pos = figurePanel.getPosition()
    const shift = direction === 'up' ? -1 : 1
    context.api._moveChild([figure.id, 'panels'], figurePanel, shift, tx => {
      tx.set([figure.id, 'state', 'currentPanelIndex'], pos + shift)
    })
  }

  isDisabled (params, context) {
    const matchSelection = this._matchSelection(params, context)
    if (matchSelection) {
      const figure = this._getFigure(params, context)
      const currentIndex = figure.getCurrentPanelIndex()
      const direction = this.config.direction
      if (figure.panels.length > 1) {
        if ((direction === 'up' && currentIndex > 0) || (direction === 'down' && currentIndex < figure.panels.length - 1)) {
          return false
        }
      }
    }
    return true
  }
}

export class OpenFigurePanelImageCommand extends BasicFigurePanelCommand {
  // We are using this command only for state computation.
  // Actual implementation of opening sub-figure is done inside OpenSubFigureSourceTool.
  execute () {
  }
}
