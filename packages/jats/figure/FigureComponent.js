'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var renderNodeComponent = require('../../../util/renderNodeComponent');

var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');


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
      var labelEditor = $$(TextPropertyEditor, {
        disabled: this.props.disabled,
        path: label.getTextPath()
      }).ref('labelEditor');
      el.append(labelEditor);
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
        $$(ContainerEditor, { node: captionNode }).ref(captionNode.id)
          .addClass('se-content')
      );
    }.bind(this));

    // TODO: we should provide a UI to the rest of the node's content
    // in an overlay

    return el;
  };
};

Component.extend(FigureComponent);

module.exports = FigureComponent;