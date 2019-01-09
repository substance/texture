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
      this._addItemToCollection(params, context)
      context.editor.send('toggleOverlay')
    }
  }

  _addItemToCollection (params, context) {
    const collectionPath = this.config.collection
    let editorSession = context.editorSession
    editorSession.transaction(tx => {
      let node = this._createNode(tx)
      documentHelpers.append(tx, collectionPath, node.id)
      // TODO: set selection
    })
  }

  _createNode (tx) {
    return tx.create({ type: this.config.type })
  }
}
