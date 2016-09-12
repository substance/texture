'use strict';

import { Component } from 'substance'

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
        src: node.getHref()
      })
    );
    return el;
  };
};

Component.extend(GraphicComponent);

export default GraphicComponent;