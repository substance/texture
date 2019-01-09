import { documentHelpers, Command } from 'substance'
import { findParentByType } from './nodeHelpers'
import CustomMetadataField from '../models/CustomMetadataField'

class BasicCustomMetadataFieldCommand extends Command {
  getCommandState (params, context) {
    return {
      disabled: this.isDisabled(params, context)
    }
  }

  isDisabled (params) {
    const xpath = params.selectionState.xpath
    return !xpath.find(n => n.type === 'custom-metadata-field')
  }
}

export class AddCustomMetadataFieldCommand extends BasicCustomMetadataFieldCommand {
  execute (params, context) {
    let collectionPath = this._getCollectionPath(params, context)
    context.editorSession.transaction(tx => {
      let node = documentHelpers.createNodeFromJson(tx, CustomMetadataField.getTemplate())
      documentHelpers.append(tx, collectionPath, node.id)
      tx.setSelection({
        type: 'property',
        path: [node.id, 'value'],
        startOffset: 0
      })
    })
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
