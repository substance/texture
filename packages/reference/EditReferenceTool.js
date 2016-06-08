'use strict';

var Component = require('substance/ui/Component');
var clone = require('lodash/clone');
var map = require('lodash/map');
var ReferenceTargets = require('./ReferenceTargets');

var TARGET_TYPES = {
  'fig': ['figure', 'fig-group'],
  'bibr': ['reference', 'element-citation', 'mixed-citation']
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
function EditReferenceTool() {
  EditReferenceTool.super.apply(this, arguments);
}

EditReferenceTool.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-edit-reference');
    var availableTargets = getTargetsForReference(node);

    el.append(
      $$(ReferenceTargets, {
        availableTargets: availableTargets
      })
    );
    return el;
  };

};

Component.extend(EditReferenceTool);

EditReferenceTool.static.getProps = function(commandStates) {
  if (commandStates.reference.mode === 'edit') {
    return clone(commandStates.reference);
  } else {
    return undefined;
  }
};

EditReferenceTool.static.name = 'edit-reference';

module.exports = EditReferenceTool;