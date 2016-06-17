'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');
var renderNodeComponent = require('../../../util/renderNodeComponent');

function FootnoteComponent() {
  Component.apply(this, arguments);
}

FootnoteComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-footnote')
      .attr('data-id', this.props.node.id);

    if (node.label) {
      var label = doc.get(node.label);
      el.append($$(TextProperty, {
        path: label.getTextPath()
      }));
    }
    // TODO: what if no label is present?

    this.props.node.nodes.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      el.append(
        renderNodeComponent(this, $$, childNode, {
          disabled: this.props.disabled
        })
      );
    }.bind(this));

    return el;
  };
};

Component.extend(FootnoteComponent);

module.exports = FootnoteComponent;