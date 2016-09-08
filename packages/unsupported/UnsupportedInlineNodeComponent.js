import { Component } from 'substance'

function UnsupportedInlineNodeComponent() {
  Component.apply(this, arguments);
}

UnsupportedInlineNodeComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('span')
      .addClass('sc-unsupported-inline-node')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append(
        '<'+this.props.node.tagName+'>'
      );
    return el;
  };
};

Component.extend(UnsupportedInlineNodeComponent);

export default UnsupportedInlineNodeComponent;