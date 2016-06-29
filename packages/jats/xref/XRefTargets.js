'use strict';

var Component = require('substance/ui/Component');
var getXRefTargets = require('./getXRefTargets');
var find = require('lodash/find');
var without = require('lodash/without');

/*
  Editing of XRefTargets
*/
function XRefTargets() {
  XRefTargets.super.apply(this, arguments);
}

XRefTargets.Prototype = function() {

  this.getInitialState = function() {
    return {
      targets: getXRefTargets(this.props.node)
    };
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-xref-targets');
    var componentRegistry = this.context.componentRegistry;

    this.state.targets.forEach(function(target) {
      var TargetComponent = componentRegistry.get(target.node.type+'-target');
      el.append(
        $$(TargetComponent, target)
          .on('click', this._toggleTarget.bind(this, target.node))
      );
    }.bind(this));
    return el;
  };

  this._toggleTarget = function(targetNode) {
    var node = this.props.node;
    var surface = this.context.surfaceManager.getFocusedSurface();

    // Update model
    var newTargets = node.targets;
    if (newTargets.indexOf(targetNode.id) > 0) {
      newTargets = without(newTargets, targetNode.id);
    } else {
      newTargets.push(targetNode.id);
    }

    // Compute visual feedback
    var targets = this.state.targets;
    var target = find(this.state.targets, function(t) {
      return t.node === targetNode;
    });

    // Flip the selected flag
    target.selected = !target.selected;

    // Triggers a rerender
    this.setState({
      targets: targets
    });

    // ATTENTION: still we need to use surface.transaction()
    surface.transaction(function(tx) {
      tx.set([node.id, 'targets'], newTargets);
    });

  };
};

Component.extend(XRefTargets);

module.exports = XRefTargets;