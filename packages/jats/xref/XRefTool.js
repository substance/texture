'use strict';

import clone from 'lodash/clone'
import { deleteSelection, Tool } from 'substance'
import XRefTargets from './XRefTargets'

/*
  Edit a reference in a prompt.
*/
function XRefTool() {
  XRefTool.super.apply(this, arguments);

  this.handleActions({
    'closeModal': this._doneEditing,
    'doneEditing': this._doneEditing
  });
}

XRefTool.Prototype = function() {

  this.render = function($$) {
    var Modal = this.getComponent('modal');
    var Prompt = this.getComponent('prompt');

    // if ($$.capturing) console.log("Rendering XRefTool, state=", this.state);
    var node = this.props.node;
    var el = $$('div').addClass('sc-xref-tool');

    el.append(
      $$(Prompt).append(
        $$(Prompt.Label, {label: this.getLabel('xref')}),
        $$(Prompt.Separator),
        $$(Prompt.Action, {name: 'edit', title: this.getLabel('edit-xref')})
          .on('click', this._onEdit),
        $$(Prompt.Action, {name: 'delete', title: this.getLabel('delete-xref')})
          .on('click', this._onDelete)
      )
    );

    if (this.state.edit) {
      el.append(
        $$(Modal, {
          width: 'large'
        }).append(
          $$(XRefTargets, {
            node: node
          }).ref('targets')
        )
      );
    }
    return el;
  };

  this._onEdit = function() {
    this.setState({
      edit: true
    });
  };

  this._doneEditing = function() {
    this.setState({
      edit: false
    });
  };

  this._onDelete = function() {
    var ds = this.context.documentSession;
    ds.transaction(function(tx, args) {
      return deleteSelection(tx, args);
    });
  };
};

Tool.extend(XRefTool);


export default XRefTool;
