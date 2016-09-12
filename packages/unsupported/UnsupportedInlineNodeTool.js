import clone from 'lodash/clone'
import { Modal, Prompt, Tool, deleteSelection } from 'substance'
import EditXML from '../common/EditXML'

/*
  Prompt shown when an unsupported node is selected.
*/
function UnsupportedInlineNodeTool() {
  UnsupportedInlineNodeTool.super.apply(this, arguments);

  this.handleActions({
    'closeModal': this._closeModal,
    'xmlSaved': this._closeModal
  });
}

UnsupportedInlineNodeTool.Prototype = function() {

  this._closeModal = function() {
    this.setState({
      editXML: false
    });
  };

  this._onEdit = function() {
    this.setState({
      editXML: true
    });
  };

  this._onDelete = function() {
    var ds = this.context.documentSession;
    ds.transaction(function(tx, args) {
      return deleteSelection(tx, args);
    });
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-unsupported-node-tool');
    var node = this.props.node;

    el.append(
      $$(Prompt).append(
        $$(Prompt.Label, {label: 'Unsupported Element'}),
        $$(Prompt.Separator),
        $$(Prompt.Action, {name: 'edit', title: 'Edit XML'})
          .on('click', this._onEdit),
        $$(Prompt.Action, {name: 'delete', title: 'Delete Element'})
          .on('click', this._onDelete)
      )
    );

    if (this.state.editXML) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EditXML, {
            node: node
          })
        )
      );
    }
    return el;
  };
};

Tool.extend(UnsupportedInlineNodeTool);

UnsupportedInlineNodeTool.getProps = function(commandStates) {
  if (commandStates['unsupported-inline'].active) {
    return clone(commandStates['unsupported-inline']);
  } else {
    return undefined;
  }
};

export default UnsupportedInlineNodeTool;
