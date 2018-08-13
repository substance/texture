import { AnnotationCommand } from 'substance'

class InsertExtLinkCommand extends AnnotationCommand {
  executeCreate (params) {
    let result = super.executeCreate(params)
    let editorSession = this._getEditorSession(params)
    editorSession.transaction((tx) => {
      tx.setSelection(tx.selection.collapse())
    })
    return result
  }
}

export default InsertExtLinkCommand
