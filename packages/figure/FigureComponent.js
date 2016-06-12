'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var renderNodeComponent = require('../../util/renderNodeComponent');

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


    var labelEditor = $$(TextPropertyEditor, {
      disabled: this.props.disabled,
      path: [ this.props.node.id, 'label']
    }).ref('labelEditor');

    el.append(labelEditor);

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
    node.captionNodes.forEach(function(nodeId) {
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

Component.extend(FigureComponent);

module.exports = FigureComponent;