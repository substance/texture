'use strict';

var InlineNodeCommand = require('substance/ui/InlineNodeCommand');

function AddXRefCommand() {
  AddXRefCommand.super.apply(this, arguments);
}

AddXRefCommand.Prototype = function() {
  this.createNodeData = function() {
    return {
      attributes: {'ref-type': 'bibr'},
      targets: [],
      label: '???',
      type: 'xref'
    };
  };
};

InlineNodeCommand.extend(AddXRefCommand);

module.exports = AddXRefCommand;