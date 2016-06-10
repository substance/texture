'use strict';

var Component = require('substance/ui/Component');
var clone = require('lodash/clone');
var Modal = require('substance/ui/Modal');
var Prompt = require('substance/ui/Prompt');
var EditXML = require('./EditXML');


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
      )
    );

    if (this.state.editXML) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EditXML, {
            path: [node.id, 'xml']
          })
        )
      );
    }
    return el;
  };
};

Component.extend(UnsupportedInlineNodeTool);

UnsupportedInlineNodeTool.static.getProps = function(commandStates) {
  if (commandStates['unsupported-inline'].mode === 'edit') {
    return clone(commandStates['unsupported-inline']);
  } else {
    return undefined;
  }
};

UnsupportedInlineNodeTool.static.name = 'unsupported-inline';

module.exports = UnsupportedInlineNodeTool;