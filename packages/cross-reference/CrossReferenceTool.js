'use strict';

var Component = require('substance/ui/Component');
var clone = require('lodash/clone');
var map = require('lodash/map');
var CrossReferenceTargets = require('./CrossReferenceTargets');

var TARGET_TYPES = {
  'fig': ['figure', 'fig-group'],
  'bibr': ['ref' /*, 'element-citation', 'mixed-citation'*/]
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
}

CrossReferenceTool.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-edit-reference');
    var availableTargets = getTargetsForReference(node);

    el.append(
      $$(CrossReferenceTargets, {
        availableTargets: availableTargets
      })
    );
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