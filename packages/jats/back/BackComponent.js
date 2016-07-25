'use strict';

var Component = require('substance/ui/Component');
var renderNodeComponent = require('../../../util/renderNodeComponent');

function BackComponent() {
  Component.apply(this, arguments);
}

BackComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-back')
      .attr('data-id', this.props.node.id);

    // Ref elements
    var children = node.nodes;
    children.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        );
      } else {
        console.info(childNode.type+ ' inside <back> currently not supported by the editor.');
      }
    }.bind(this));

    return el;
  };
};

Component.extend(BackComponent);

module.exports = BackComponent;