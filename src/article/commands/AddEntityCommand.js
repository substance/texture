import { Command, documentHelpers } from 'substance'

/**
 * A base implementation for commands that add an entity, e.g. a Reference, to
 * a collection.
 */
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
