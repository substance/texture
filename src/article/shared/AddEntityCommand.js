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
      const appState = context.appState
      const viewName = appState.get('viewName')
      // ATTENTION: for now when an entity is added from within the manuscript view
      // we switch to the metadata view and then execute the command again
      // However, this is tricky, because this needs be done by a different CommandManager.
      // ATTENTION 2: some entities are allowed in both views (such as Footnotes)
      // For now we use `config.metadataOnly` for those entity types which are only
      // available in the metadata view
      if (viewName !== 'metadata' && this.config.metadataOnly) {
        context.editor.send('updateViewName', 'metadata')
        // HACK: using the ArticlePanel instance to get to the current editor
        // so that we can dispatch 'executeCommand'
        context.articlePanel.refs.content.send('executeCommand', this.name, params)
      } else {
        this._addItemToCollection(params, context)
        context.editor.send('toggleOverlay')
      }
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
