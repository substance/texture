import { Command, uuid, documentHelpers, deleteSelection } from 'substance'

class TagContribCommand extends Command {

  getCommandState(params, context) {
    var documentSession = context.documentSession;
    var doc = documentSession.getDocument();

    var sel = this._getSelection(params);
    var disabled = true;
    var stringName; // author name without components

    if (sel.isPropertySelection() && !sel.isCollapsed()) {
      disabled = false;
      stringName = documentHelpers.getTextForSelection(doc, sel);
    }

    return {
      disabled: disabled,
      stringName: stringName,
      active: false
    };
  }

  execute(params, context) {
    var stringName = params.stringName;
    var documentSession = context.documentSession;

    documentSession.transaction(function(tx, args) {
      var contribGroupNodeId = tx.document.getContribGroup().id;
      var contribGroupNode = tx.get(contribGroupNodeId);
      var newContrib = {
        id: uuid('contrib'),
        type: 'contrib',
        xmlContent: '<string-name>'+stringName+'</string-name>',
        attributes: {
          generator: 'texture'
        }
      };

      var contribNode = tx.create(newContrib);
      contribGroupNode.show(contribNode.id);
      args = deleteSelection(tx, args);
      return args;
    });

    return {status: 'ok'};
  }

}

export default TagContribCommand
