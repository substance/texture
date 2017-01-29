import { Command, uuid, documentHelpers } from 'substance'
import { getContribGroup } from '../../common/articleUtils'

class TagAffCommand extends Command {

  getCommandState(params, context) {
    let editorSession = context.editorSession
    let doc = editorSession.getDocument()
    let sel = this._getSelection(params)
    let disabled = true
    let stringName // author name without components

    if (sel.isPropertySelection() && !sel.isCollapsed()) {
      disabled = false
      stringName = documentHelpers.getTextForSelection(doc, sel)
    }

    return {
      disabled: disabled,
      stringName: stringName,
      active: false
    }
  }

  execute(params, context) {
    let { stringName } = params.commandState
    let editorSession = context.editorSession
    let doc = editorSession.getDocument()
    // Returns the first contrib-group node found
    // NOTE: only the that first one is considered by the editor
    let contribGroupNodeId = getContribGroup(doc).id
    editorSession.transaction(function(tx) {
      let contribGroupNode = tx.get(contribGroupNodeId)
      let newAff = {
        id: uuid('aff'),
        type: 'aff',
        xmlContent: stringName,
        attributes: {
          generator: 'texture'
        }
      }
      let affNode = tx.create(newAff)
      contribGroupNode.show(affNode.id)
      tx.deleteSelection()
    })
    return {status: 'ok'}
  }

}
export default TagAffCommand
