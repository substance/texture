'use strict';

var includes = require('lodash/includes');
var map = require('lodash/map');
var orderBy = require('lodash/orderBy');

var TARGET_TYPES = {
  'fig': ['figure', 'fig-group'],
  'bibr': ['ref'],
  'table': ['table-wrap']
};

/*
  Computes available targets for a given reference node

  Returns an array of entries with all info needed by XRefTargets to render
  [
    {
      selected: true,
      node: TARGET_NODE
    }
    ,...
  ]
*/
function getXRefTargets(node) {
  var doc = node.getDocument();
  var selectedTargets = node.targets;
  var nodesByType = doc.getIndex('type');
  var refType = node.referenceType;
  var targetTypes = TARGET_TYPES[refType];
  var targets = [];

  targetTypes.forEach(function(targetType) {
    var nodesForType = map(nodesByType.get(targetType));

    nodesForType.forEach(function(node) {
      var isSelected = includes(selectedTargets, node.id);
      targets.push({
        selected: isSelected,
        node: node
      });
    });
  });

  // Makes the selected targets go to top
  targets = orderBy(targets, ['selected'], ['desc']);
  return targets;
}

module.exports = getXRefTargets;