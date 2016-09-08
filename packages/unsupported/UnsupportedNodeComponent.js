'use strict';

import { Component } from 'substance'

function UnsupportedNodeComponent() {
  Component.apply(this, arguments);
}

UnsupportedNodeComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('span')
      .addClass('sc-unsupported-inline-node')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append(
        $$('button').addClass('se-toggle').append(
          $$('pre').append(
            $$('code').append(
              '<'+this.props.node.tagName+'>'
            )
          )
        )
      );
    return el;
  };
};

Component.extend(UnsupportedNodeComponent);

UnsupportedNodeComponent.fullWidth = true;
UnsupportedNodeComponent.noStyle = true;

export default UnsupportedNodeComponent;