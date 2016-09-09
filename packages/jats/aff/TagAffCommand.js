'use strict';

var Command = require('substance/ui/Command');
var uuid = require('substance/util/uuid');
var documentHelpers = require('substance/model/documentHelpers');
var deleteSelection = require('substance/model/transform/deleteSelection');


class TagAffCommand extends Command {

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
      var newAff = {
        id: uuid('aff'),
        type: 'aff',
        xmlContent: stringName,
        attributes: {
          generator: 'texture'
        }
      };

      var affNode = tx.create(newAff);
      contribGroupNode.show(affNode.id);
      args = deleteSelection(tx, args);
      return args;
    });

    return {status: 'ok'};
  }

}
module.exports = TagAffCommand;
