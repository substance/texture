import { InlineNodeCommand } from 'substance'

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

export default AddXRefCommand
