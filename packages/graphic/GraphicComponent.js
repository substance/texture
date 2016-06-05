'use strict';

var Component = require('substance/ui/Component');

function GraphicComponent() {
  Component.apply(this, arguments);
}

GraphicComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('div')
      .addClass('sc-graphic')
      .attr('data-id', this.props.node.id);
    el.append(
      $$('img').attr({
        src: this.props.node.href
      })
    );
    return el;
  };
};

Component.extend(GraphicComponent);

module.exports = GraphicComponent;