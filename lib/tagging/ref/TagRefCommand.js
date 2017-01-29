import { Command, uuid } from 'substance'
import { getRefList } from '../../common/articleUtils'

class TagRefCommand extends Command {

  getCommandState(params, context) {
    let editorSession = context.editorSession
    let doc = editorSession.getDocument()
    let sel = this._getSelection(params)
    let disabled = true
    let nodeIds // All nodes included in the selection

    if (sel.isPropertySelection()) {
      disabled = false
      nodeIds = [ sel.path[0] ]
    } else if (sel.isContainerSelection()) {
      let fragments = sel.getFragments()
      nodeIds =
        fragments.map(frag => frag.path[0])
      let isParagraph =
        nodeId => doc.get(nodeId).type === 'paragraph'
      let onlyParagraphs =
        (nodeIds) => nodeIds.every(isParagraph)
      if (onlyParagraphs(nodeIds)) {
        disabled = false
      }
    }

    return {
      disabled: disabled,
      nodeIds: nodeIds,
      active: false
    }
  }

  execute(params, context) {
    let { nodeIds } = params.commandState
    let editorSession = context.editorSession
    let doc = editorSession.getDocument()
    let focusedSurface = context.surfaceManager.getFocusedSurface()
    let refListId = getRefList(doc).id

    editorSession.transaction(function(tx) {
      let refListNode = tx.get(refListId)
      nodeIds.forEach(nodeId => {
        let p = tx.get(nodeId)
        let newRef = {
          id: uuid('ref'),
          type: 'ref',
          xmlContent: '<mixed-citation>'+p.content+'</mixed-citation>',
          attributes: {
            generator: 'texture'
          }
        }
        // console.log('newRef', newRef)
        let refNode = tx.create(newRef)
        refListNode.show(refNode.id)
        // Remove original paragraphs from container
        // We need to look up the owning container
        // by inspecting the focused surface.
        let containerId = focusedSurface.getContainerId()
        if (containerId) {
          let container = tx.get(containerId)
          container.hide(nodeId)
          tx.delete(nodeId)
        }
        tx.selection = null
      })
    })
    return {status: 'ok'}
  }

}
export default TagRefCommand
