'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');
var renderNode = require('substance/util/renderNode');

function FigureComponent() {
  Component.apply(this, arguments);
}

FigureComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-figure')
      .attr('data-id', this.props.node.id)
      .append($$(TextProperty, {
        path: [ this.props.node.id, 'label']
      }));

    // Display figure content
    node.contentNodes.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      el.append(
        renderNode($$, this, childNode)
      );
    }.bind(this));

    // Display Captions
    node.captionNodes.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      el.append(
        renderNode($$, this, childNode)
      );
    }.bind(this));

    return el;
  };
};

Component.extend(FigureComponent);

module.exports = FigureComponent;