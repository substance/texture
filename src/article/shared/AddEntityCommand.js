import { Command, documentHelpers } from 'substance'

export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }

  execute (params, context) {
    const workflow = this.config.workflow
    if (workflow) {
      context.editor.send('startWorkflow', workflow)
    } else {
      // If command requires switching view, then we frst switching to metadate view
      // and then adding entity to the collection
      const appState = context.appState
      const viewName = appState.get('viewName')
      if (this.config.switchView && viewName !== 'metadata') {
        context.editor.send('updateViewName', 'metadata')
      }
      this._addItemToCollection(params, context)
      context.editor.send('toggleOverlay')
    }
  }

  _addItemToCollection (params, context) {
    const api = context.api
    const collectionPath = this.config.collection
    let editorSession = context.editorSession
    editorSession.transaction(tx => {
      let node = this._createNode(tx)
      documentHelpers.append(tx, collectionPath, node.id)
      tx.selection = api._selectFirstRequiredPropertyOfMetadataCard(node)
    })
  }

  _createNode (tx) {
    return tx.create({ type: this.config.type })
  }
}
