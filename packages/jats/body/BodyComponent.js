'use strict';

var Component = require('substance/ui/Component');
var ContainerEditor = require('substance/ui/ContainerEditor');

function BodyComponent() {
  Component.apply(this, arguments);
}

BodyComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var configurator = this.props.configurator;
    var el = $$('div')
      .addClass('sc-body')
      .attr('data-id', this.props.node.id);

    el.append(
      $$(ContainerEditor, {
        disabled: this.props.disabled,
        node: node,
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('body')
    );
    return el;
  };
};


Component.extend(BodyComponent);

module.exports = BodyComponent;