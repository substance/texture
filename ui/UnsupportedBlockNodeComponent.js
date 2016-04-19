'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');

function UnsupportedBlockNodeComponent() {
  Component.apply(this, arguments);
}

UnsupportedBlockNodeComponent.Prototype = function() {

  this.render = function($$) {
    return $$('span')
      .addClass('sc-unsupported-block-node')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      // .append('<?XML>')
      .append($$(TextProperty, {
        path: [ this.props.node.id, "xml"]
      }));
  };
};

Component.extend(UnsupportedBlockNodeComponent);

module.exports = UnsupportedBlockNodeComponent;