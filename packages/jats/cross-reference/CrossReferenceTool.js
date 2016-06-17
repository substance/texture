'use strict';

var Component = require('substance/ui/Component');
var clone = require('lodash/clone');
var map = require('lodash/map');
var Modal = require('substance/ui/Modal');
var CrossReferenceTargets = require('./CrossReferenceTargets');
var Prompt = require('substance/ui/Prompt');
var deleteSelection = require('substance/model/transform/deleteSelection');

var TARGET_TYPES = {
  'fig': ['figure', 'fig-group'],
  'bibr': ['ref' /*, 'element-citation', 'mixed-citation'*/],
  'table': ['table-wrap']
};

/*
  Computes available targets for a given reference node
*/
function getTargetsForReference(node) {
  var doc = node.getDocument();
  var nodesByType = doc.getIndex('type');
  var refType = node.referenceType;
  var targetTypes = TARGET_TYPES[refType];
  var targetNodes = [];
  targetTypes.forEach(function(targetType) {
    var nodesForType = map(nodesByType.get(targetType));
    targetNodes = targetNodes.concat(nodesForType);
  });
  return targetNodes;
}

/*
  Edit a reference in a prompt.
*/
function CrossReferenceTool() {
  CrossReferenceTool.super.apply(this, arguments);

  this.handleActions({
    'closeModal': this._doneEditing,
    'doneEditing': this._doneEditing
  });
}

CrossReferenceTool.Prototype = function() {

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

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-cross-reference-tool');

    el.append(
      $$(Prompt).append(
        $$(Prompt.Label, {label: this.getLabel('cross-reference')}),
        $$(Prompt.Separator),
        $$(Prompt.Action, {name: 'edit', title: this.getLabel('edit-reference')})
          .on('click', this._onEdit),
        $$(Prompt.Action, {name: 'delete', title: this.getLabel('delete-reference')})
          .on('click', this._onDelete)
      )
    );

    if (this.state.edit) {
      var availableTargets = getTargetsForReference(node);
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(CrossReferenceTargets, {
            availableTargets: availableTargets
          })
        )
      );
    }
    return el;
  };
};

Component.extend(CrossReferenceTool);

CrossReferenceTool.static.getProps = function(commandStates) {
  if (commandStates['cross-reference'].mode === 'edit') {
    return clone(commandStates['cross-reference']);
  } else {
    return undefined;
  }
};

CrossReferenceTool.static.name = 'cross-reference';

module.exports = CrossReferenceTool;