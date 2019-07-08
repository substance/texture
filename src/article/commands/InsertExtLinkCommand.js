import { AnnotationCommand } from 'substance'

export default class InsertExtLinkCommand extends AnnotationCommand {
  executeCreate (params, context) {
    let result = super.executeCreate(params)
    let editorSession = context.editorSession
    editorSession.transaction((tx) => {
      tx.setSelection(tx.selection.collapse())
    })
    return result
  }
}
