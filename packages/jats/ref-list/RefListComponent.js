'use strict';

var Component = require('substance/ui/Component');
var ContainerEditor = require('substance/ui/ContainerEditor');
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
    el.append(
      $$(ContainerEditor, { node: node }).ref('contentEditor')
        .addClass('se-content')
    );
    return el;
  };
};

Component.extend(RefListComponent);

// Isolated Nodes config
RefListComponent.static.fullWidth = true;
RefListComponent.static.noStyle = true;

module.exports = RefListComponent;