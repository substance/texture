'use strict';

var Component = require('substance/ui/Component');
var renderNodeComponent = require('../../../util/renderNodeComponent');

function RefListComponent() {
  Component.apply(this, arguments);
}

RefListComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();
    var el = $$('div').addClass('sc-ref-list');

    // NOTE: We don't yet expose RefList.label to the editor
    if (node.title) {
      var titleNode = doc.get(node.title);
      el.append(
        renderNodeComponent(this, $$, titleNode, {
          disabled: this.props.disabled
        })
      );
    }

    // Ref elements
    var children = node.nodes;
    children.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        );
      } else {
        console.info(childNode.type+ ' inside <ref-list> currently not supported by the editor.');
      }
    }.bind(this));

    return el;
  };
};

Component.extend(RefListComponent);

// Isolated Nodes config
RefListComponent.fullWidth = true;
RefListComponent.noStyle = true;

module.exports = RefListComponent;