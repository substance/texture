'use strict';

var Component = require('substance/ui/Component');

function GraphicComponent() {
  Component.apply(this, arguments);
}

GraphicComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div')
      .addClass('sc-graphic')
      .attr('data-id', node.id);
    el.append(
      $$('img').attr({
        src: node.attributes.href
      })
    );
    return el;
  };
};

Component.extend(GraphicComponent);

module.exports = GraphicComponent;