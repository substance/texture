'use strict';

var Component = require('substance/ui/Component');
var ContainerEditor = require('substance/ui/ContainerEditor');

function BackComponent() {
  Component.apply(this, arguments);
}

BackComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var configurator = this.props.configurator;
    var el = $$('div')
      .addClass('sc-back')
      .attr('data-id', this.props.node.id);

    el.append(
      $$(ContainerEditor, {
        disabled: this.props.disabled,
        node: node,
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('back')
    );

    return el;
  };
};

Component.extend(BackComponent);

module.exports = BackComponent;