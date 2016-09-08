import { Command, uuid, Selection } from 'substance'

class TagRefCommand extends Command {

  getCommandState(params, context) {
    var documentSession = context.documentSession;
    var doc = documentSession.getDocument();

    var sel = this._getSelection(params);
    var disabled = true;
    var nodeIds; // all nodes included in the selection

    if (sel.isPropertySelection()) {
      disabled = false;
      nodeIds = [ sel.path[0] ];
    } else if (sel.isContainerSelection()) {
      var fragments = sel.getFragments();
      nodeIds =
        fragments.map(frag => frag.path[0]);
      var isParagraph =
        nodeId => doc.get(nodeId).type === 'paragraph';
      var onlyParagraphs =
        (nodeIds) => nodeIds.every(isParagraph);

      if (onlyParagraphs(nodeIds)) {
        disabled = false;
      }
    }

    return {
      disabled: disabled,
      nodeIds: nodeIds,
      active: false
    };
  }

  execute(params, context) {
    var nodeIds = params.nodeIds;
    var documentSession = context.documentSession;
    var focusedSurface = context.surfaceManager.getFocusedSurface();

    documentSession.transaction(function(tx) {
      var refListId = tx.document.getRefList().id;
      var refListNode = tx.get(refListId);

      nodeIds.forEach(nodeId => {
        var p = tx.get(nodeId);
        var newRef = {
          id: uuid('ref'),
          type: 'ref',
          xmlContent: '<mixed-citation>'+p.content+'</mixed-citation>',
          attributes: {
            generator: 'texture'
          }
        };
        var refNode = tx.create(newRef);
        refListNode.show(refNode.id);

        // Remove original paragraphs from container
        // We need to look up the owning container
        // by inspecting the focused surface.
        var containerId = focusedSurface.getContainerId();
        if (containerId) {
          var container = tx.get(containerId);
          container.hide(nodeId);
          tx.delete(nodeId);
        }
      });

      return {
        selection: Selection.nullSelection
      };
    });

    return {status: 'ok'};
  }

}
export default TagRefCommand
