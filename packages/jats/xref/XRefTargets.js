'use strict';

var clone = require('lodash/clone');
var find = require('lodash/find');
var without = require('lodash/without');
var Component = require('substance/ui/Component');
var getXRefTargets = require('./getXRefTargets');

/*
  Editing of XRefTargets
*/
function XRefTargets() {
  XRefTargets.super.apply(this, arguments);
  // console.log('Created XRefTargets', this.__id__);
}

XRefTargets.Prototype = function() {

  this.getInitialState = function() {
    return {
      targets: getXRefTargets(this.props.node)
    };
  };

  // this.willReceiveProps = function() {
  //   console.log('XRefTargets.willReceiveProps', this.__id__);
  // };

  // this.dispose = function() {
  //   console.log('XRefTargets.dispose', this.__id__);
  // };

  this.render = function($$) {
    var el = $$('div').addClass('sc-xref-targets');
    var componentRegistry = this.context.componentRegistry;

    this.state.targets.forEach(function(target) {
      var TargetComponent = componentRegistry.get(target.node.type+'-target');
      var props = clone(target);
      // disable editing in TargetComponent
      props.disabled = true;
      el.append(
        $$(TargetComponent, props)
          .on('click', this._toggleTarget.bind(this, target.node))
      );
    }.bind(this));
    return el;
  };

  this._toggleTarget = function(targetNode) {
    var node = this.props.node;
    var surface = this.context.surfaceManager.getFocusedSurface();
    // console.log('XRefTargets: toggling target of ', node.id);

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

    // console.log('XRefTargets: setting targets of ', node.id, 'to', newTargets);
    // ATTENTION: still we need to use surface.transaction()
    surface.transaction(function(tx) {
      tx.set([node.id, 'targets'], newTargets);
    });
  };
};

Component.extend(XRefTargets);

module.exports = XRefTargets;