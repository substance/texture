'use strict';

var Component = require('substance/ui/Component');
var renderNodeComponent = require('../../../util/renderNodeComponent');

function ContribGroupComponent() {
  Component.apply(this, arguments);
}

ContribGroupComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-contrib-group')
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

    el.append($$('button').addClass('se-add-author').append('Add Author'));
    return el;
  };
};

Component.extend(ContribGroupComponent);

module.exports = ContribGroupComponent;