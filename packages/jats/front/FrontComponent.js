'use strict';

var Component = require('substance/ui/Component');
var ContainerEditor = require('substance/ui/ContainerEditor');

function FrontComponent() {
  Component.apply(this, arguments);
}

FrontComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var configurator = this.props.configurator;

    var el = $$('div')
      .addClass('sc-front')
      .attr('data-id', this.props.node.id);

    el.append($$('h1').append('Front'));

    el.append(
      $$(ContainerEditor, {
        disabled: this.props.disabled,
        node: node,
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('front')
    );

    return el;
  };
};

Component.extend(FrontComponent);

module.exports = FrontComponent;