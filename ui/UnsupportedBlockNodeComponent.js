'use strict';

var Component = require('substance/ui/Component');

function UnsupportedBlockNodeComponent() {
  Component.apply(this, arguments);
}

UnsupportedBlockNodeComponent.Prototype = function() {

  this.render = function($$) {
    return $$('span')
      .addClass('sc-unsupported-block-node')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append(
        '<'+this.props.node.tagName+'>'
      );
  };
};

Component.extend(UnsupportedBlockNodeComponent);

module.exports = UnsupportedBlockNodeComponent;