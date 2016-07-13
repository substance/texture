'use strict';

var Component = require('substance/ui/Component');
var renderNodeComponent = require('../../../util/renderNodeComponent');

function FrontComponent() {
  Component.apply(this, arguments);
}

FrontComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-front')
      .attr('data-id', this.props.node.id);

    // Render articlemeta
    var articleMeta = doc.get(node.articleMeta);

    el.append(
      renderNodeComponent(this, $$, articleMeta, {
        disabled: this.props.disabled
      })
    );

    return el;
  };
};

Component.extend(FrontComponent);

module.exports = FrontComponent;