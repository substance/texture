'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');

function FigureComponent() {
  Component.apply(this, arguments);
}

FigureComponent.Prototype = function() {

  this.render = function($$) {
    var surface = this.context.surface;

    var el = $$('div')
      .addClass('sc-figure')
      .attr('data-id', this.props.node.id)
      .append($$(TextProperty, {
        path: [ this.props.node.id, 'label']
      }));

    // Display figure content
    this.props.node.contentNodes.forEach(function(nodeId) {
      el.append(
        surface._renderNode($$, nodeId)
      );
    }.bind(this)); 

    // Display Captions
    this.props.node.captionNodes.forEach(function(nodeId) {
      el.append(
        surface._renderNode($$, nodeId)
      );
    }.bind(this));
   
    return el;
  };
};

Component.extend(FigureComponent);

module.exports = FigureComponent;