import { documentHelpers, Command } from 'substance'
import { findParentByType } from './nodeHelpers'
import CustomMetadataField from '../models/CustomMetadataField'

class BasicCustomMetadataFieldCommand extends Command {
  get contextType () {
    return 'custom-metadata-field'
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
    if (node.type !== 'figure-panel') {
      const parentFigurePanel = findParentByType(node, 'figure-panel')
      figurePanelId = parentFigurePanel.id
    }
    return [figurePanelId, 'metadata']
  }
}

export class AddCustomMetadataFieldCommand extends BasicCustomMetadataFieldCommand {
  get contextType () {
    return 'figure-panel'
  }

  execute (params, context) {
    const collectionPath = this._getCollectionPath(params, context)
    context.editorSession.transaction(tx => {
      let node = documentHelpers.createNodeFromJson(tx, CustomMetadataField.getTemplate())
      documentHelpers.append(tx, collectionPath, node.id)
      // TODO: we need to pass surfaceId here
      tx.setSelection({
        type: 'property',
        path: [node.id, 'value'],
        startOffset: 0
      })
    })
  }
}

export class RemoveCustomMetadataFieldCommand extends BasicCustomMetadataFieldCommand {
  execute (params, context) {
    const collectionPath = this._getCollectionPath(params, context)
    context.editorSession.transaction(tx => {
      const nodeId = tx.selection.getNodeId()
      documentHelpers.remove(tx, collectionPath, nodeId)
      tx.selection = null
    })
  }
}

export class MoveCustomMetadataFieldCommand extends BasicCustomMetadataFieldCommand {
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
