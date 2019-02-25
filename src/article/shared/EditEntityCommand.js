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
      context.editor.send('updateViewName', 'metadata')
      context.articlePanel.refs.content.send('executeCommand', this.name, params)
    } else {
      const api = context.api
      const editorSession = params.editorSession
      const doc = editorSession.getDocument()
      const sel = params.selection
      const node = doc.get(sel.nodeId)
      const newSel = api._selectFirstRequiredPropertyOfMetadataCard(node)
      api._setSelection(newSel)
    }
  }
}
