'use strict';

var Component = require('substance/ui/Component');
var renderNodeComponent = require('../../../util/renderNodeComponent');

function FigureComponent() {
  Component.apply(this, arguments);
}

FigureComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-figure')
      .attr('data-id', this.props.node.id);

    if (node.label) {
      var label = doc.get(node.label);
      el.append(
        renderNodeComponent(this, $$, label, {
          disabled: this.props.disabled
        })
      );
    }

    // Display figure content
    node.contentNodes.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      el.append(
        renderNodeComponent(this, $$, childNode, {
          disabled: this.props.disabled
        })
      );
    }.bind(this));

    // Display Captions
    node.captions.forEach(function(nodeId) {
      var captionNode = doc.get(nodeId);

      el.append(
        renderNodeComponent(this, $$, captionNode, {
          disabled: this.props.disabled
        })
      );
    }.bind(this));

    // TODO: we should provide a UI to the rest of the node's content
    // in an overlay
    return el;
  };
};

Component.extend(FigureComponent);

module.exports = FigureComponent;