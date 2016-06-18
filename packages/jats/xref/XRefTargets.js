'use strict';

var Component = require('substance/ui/Component');

/**
  Takes a list of available reference targets (e.g. figure nodes)
  and a list of ids (selected targets)
*/
function XRefTargets() {
  XRefTargets.super.apply(this, arguments);
}

XRefTargets.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-xref-targets');
    var node = this.props.node;
    var componentRegistry = this.context.componentRegistry;
    var availableTargets = this.props.availableTargets;

    availableTargets.forEach(function(targetNode) {
      var TargetComponent = componentRegistry.get(targetNode.type+'-target');
      el.append(
        $$(TargetComponent, {node: targetNode})
      );
    });
    return el;
  };
};

Component.extend(XRefTargets);

module.exports = XRefTargets;