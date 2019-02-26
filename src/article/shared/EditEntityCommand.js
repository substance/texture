import { Command } from 'substance'

/*
  This command intended to switch view and scroll to the selected node.
  Command state becoming active only for certain type of custom selection,
  e.g. if you want to use it, provide config with selectionType property.
*/
export default class EditEntityCommand extends Command {
  getCommandState (params, context) {
    let sel = params.selection
    let newState = {
      disabled: true
    }

    if (sel.isCustomSelection()) {
      if (sel.customType === this.config.selectionType) {
        newState.disabled = false
        newState.nodeId = sel.nodeId
      }
    }

    return newState
  }

  execute (params, context) {
    const appState = context.appState
    const viewName = appState.get('viewName')
    if (viewName !== 'metadata') {
      const sel = params.selection
      const nodeId = sel.nodeId
      context.editor.send('updateViewName', 'metadata')
      // HACK: using the ArticlePanel instance to get to the current editor
      // so that we can dispatch 'executeCommand'
      let editor = context.articlePanel.refs.content
      editor.send('scrollTo', { nodeId })
      // HACK: this is a mess because context.api is a different instance after
      // switching to metadata view
      // TODO: we should extend ArticleAPI to allow for this
      editor.api.selectFirstRequiredPropertyOfMetadataCard(nodeId)
    }
  }
}
