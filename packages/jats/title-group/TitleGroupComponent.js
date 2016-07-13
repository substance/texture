'use strict';

var Component = require('substance/ui/Component');
var renderNodeComponent = require('../../../util/renderNodeComponent');

function TitleGroupComponent() {
  Component.apply(this, arguments);
}

TitleGroupComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-title-group')
      .attr('data-id', this.props.node.id);

    var children = node.nodes;
    children.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        );
      }
    }.bind(this));
    return el;
  };
};

Component.extend(TitleGroupComponent);

module.exports = TitleGroupComponent;