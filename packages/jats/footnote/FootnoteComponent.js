'use strict';

import { Component, TextPropertyComponent } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

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
      el.append($$(TextPropertyComponent, {
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

export default FootnoteComponent;