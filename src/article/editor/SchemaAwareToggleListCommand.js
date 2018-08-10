import { ListPackage } from 'substance'

const ToggleListCommand = ListPackage.ToggleListCommand

export default class SchemaAwareToggleListCommand extends ToggleListCommand {
  getCommandState (params) {
    let commandState = super.getCommandState(params)
    // Note: in addition to the regular ListToggleCommand
    // this one checks the schema if it is ok to insert a <list> at the current position
    if (commandState.action === 'switchTextType') {
      let editorSession = params.editorSession
      let sel = params.selection
      let doc = editorSession.getDocument()
      let path = sel.path
      let node = doc.get(path[0])
      let parentNode = node.parentNode
      if (parentNode) {
        let elementSchema = parentNode.constructor._elementSchema
        if (elementSchema) {
          if (elementSchema.isAllowed('list')) {
            return commandState
          }
        }
      }
    } else {
      return commandState
    }
    // otherwise
    return { disabled: true }
  }
}
