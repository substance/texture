'use strict';

var Component = require('substance/ui/Component');
var clone = require('lodash/clone');
var Modal = require('substance/ui/Modal');
var XRefTargets = require('./XRefTargets');
var Prompt = require('substance/ui/Prompt');
var deleteSelection = require('substance/model/transform/deleteSelection');

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
          })
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

Component.extend(XRefTool);

XRefTool.static.getProps = function(commandStates) {
  if (commandStates['xref'].mode === 'edit') {
    return clone(commandStates['xref']);
  } else {
    return undefined;
  }
};

XRefTool.static.name = 'xref';

module.exports = XRefTool;