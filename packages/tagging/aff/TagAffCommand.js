import { Command, uuid, documentHelpers, deleteSelection } from 'substance'

class TagAffCommand extends Command {

  getCommandState(params, context) {
    let documentSession = context.documentSession
    let doc = documentSession.getDocument()

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
    let stringName = params.stringName
    let documentSession = context.documentSession

    documentSession.transaction(function(tx, args) {
      let contribGroupNodeId = tx.document.getContribGroup().id
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
      args = deleteSelection(tx, args)
      return args
    })

    return {status: 'ok'}
  }

}
export default TagAffCommand
