'use strict';

var Component = require('substance/ui/Component');

var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');

function RefListComponent() {
  Component.apply(this, arguments);
}

RefListComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    // var doc = node.getDocument();

    var el = $$('div').addClass('sc-ref-list');

    // NOTE: We don't expose RefList.label to the editor

    if (node.title) {
      el.append(
        $$(TextPropertyEditor, { path: [node.id, 'title'] }).ref('titleEditor')
          .addClass('se-title')
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