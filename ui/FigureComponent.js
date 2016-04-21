'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');
var Caption = require('./CaptionComponent');

function FigureComponent() {
  Component.apply(this, arguments);
}

FigureComponent.Prototype = function() {

  this.render = function($$) {
    var doc = this.props.node.getDocument();

    var el = $$('div')
      .addClass('sc-figure')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append($$(TextProperty, {
        path: [ this.props.node.id, 'label']
      }));

    // Display Captions
    this.props.node.captionNodes.forEach(function(captionNodeId) {
      var node = doc.get(captionNodeId);
      el.append(
        $$(Caption, {
          doc: doc,
          node: node
        })
      );
    }.bind(this));

    // TODO: add figure content
    return el;
  };
};

Component.extend(FigureComponent);

module.exports = FigureComponent;