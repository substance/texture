'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');

function UnsupportedNodeComponent() {
  Component.apply(this, arguments);
}

UnsupportedNodeComponent.Prototype = function() {

  this.render = function($$) {
    return $$('div')
      .addClass('sc-unsupported-node')
      .attr("data-id", this.props.node.id)
      .append($$(TextProperty, {
        path: [ this.props.node.id, "content"]
      }));
  };
};

Component.extend(UnsupportedNodeComponent);

module.exports = UnsupportedNodeComponent;