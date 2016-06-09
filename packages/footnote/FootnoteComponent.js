'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');

function FootnoteComponent() {
  Component.apply(this, arguments);
}

FootnoteComponent.Prototype = function() {

  this.render = function($$) {
    var surface = this.context.surface;
    var doc = this.context.documentSession.getDocument();

    var el = $$('div')
      .addClass('sc-footnote')
      .attr('data-id', this.props.node.id)
      .append($$(TextProperty, {
        path: [ this.props.node.id, 'label']
      }));

    this.props.node.contentNodes.forEach(function(nodeId) {
      var node = doc.get(nodeId);
      el.append(
        surface._renderNode($$, node)
      );
    }.bind(this));

    return el;
  };
};

Component.extend(FootnoteComponent);

module.exports = FootnoteComponent;