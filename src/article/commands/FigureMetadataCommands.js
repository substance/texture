import { documentHelpers, Command } from 'substance'
import { findParentByType } from '../shared/nodeHelpers'
import { Figure, MetadataField, FigurePanel } from '../nodes'

// TODO: refactor this so that editorSession.transaction() is not used directly
// but only via context.api.
// Also, this implementation is kind of tight to Figures. However, such metadata fields could occurr in other environments as well, e.g. tables.
// And pull out commands in individual files.

class BasicFigureMetadataCommand extends Command {
  get contextType () {
    return MetadataField.type
  }

  getCommandState (params, context) {
    return {
      disabled: this.isDisabled(params, context)
    }
  }

  isDisabled (params) {
    const xpath = params.selectionState.xpath
    return !xpath.find(n => n.type === this.contextType)
  }

  _getCollectionPath (params, context) {
    const doc = params.editorSession.getDocument()
    const nodeId = params.selection.getNodeId()
    const node = doc.get(nodeId)
    let figurePanelId = node.id
    if (params.selection.type === 'node' && this.contextType === Figure.type) {
      const currentIndex = node.getCurrentPanelIndex()
      figurePanelId = node.panels[currentIndex]
    } else if (node.type !== FigurePanel.type) {
      const parentFigurePanel = findParentByType(node, FigurePanel.type)
      figurePanelId = parentFigurePanel.id
    }
    return [figurePanelId, 'metadata']
  }
}

export class AddFigureMetadataFieldCommand extends BasicFigureMetadataCommand {
  get contextType () {
    return 'figure'
  }

  execute (params, context) {
    const collectionPath = this._getCollectionPath(params, context)
    context.editorSession.transaction(tx => {
      let node = documentHelpers.createNodeFromJson(tx, MetadataField.getTemplate())
      documentHelpers.append(tx, collectionPath, node.id)
      const path = [node.id, 'name']
      const viewName = context.appState.viewName
      const surfaceId = context.api._getSurfaceId(node, 'name', viewName)
      tx.setSelection({
        type: 'property',
        path,
        startOffset: 0,
        surfaceId
      })
    })
  }
}

export class RemoveMetadataFieldCommand extends BasicFigureMetadataCommand {
  execute (params, context) {
    const collectionPath = this._getCollectionPath(params, context)
    context.editorSession.transaction(tx => {
      const nodeId = tx.selection.getNodeId()
      documentHelpers.removeFromCollection(tx, collectionPath, nodeId)
      tx.selection = null
    })
  }
}

export class MoveMetadataFieldCommand extends BasicFigureMetadataCommand {
  execute (params, context) {
    const direction = this.config.direction
    const collectionPath = this._getCollectionPath(params, context)
    const nodeId = params.selection.getNodeId()
    const doc = context.editorSession.getDocument()
    const customField = doc.get(nodeId)
    const shift = direction === 'up' ? -1 : 1
    context.api._moveChild(collectionPath, customField, shift)
  }

  isDisabled (params, context) {
    const matchSelection = !super.isDisabled(params)
    if (matchSelection) {
      const direction = this.config.direction
      const collectionPath = this._getCollectionPath(params, context)
      const nodeId = params.selection.getNodeId()
      const doc = context.editorSession.getDocument()
      const customFieldsIndex = doc.get(collectionPath)
      const currentIndex = customFieldsIndex.indexOf(nodeId)
      if (customFieldsIndex.length > 0) {
        if ((direction === 'up' && currentIndex > 0) || (direction === 'down' && currentIndex < customFieldsIndex.length - 1)) {
          return false
        }
      }
    }
    return true
  }
}
