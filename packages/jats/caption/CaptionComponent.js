'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');

function CaptionComponent() {
  Component.apply(this, arguments);
}

CaptionComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-caption')
      .attr('data-id', node.id);

    if (node.title) {
      var title = doc.get(node.title);
      el.append($$(TextPropertyEditor, {
        disabled: this.props.disabled,
        path: title.getTextPath()
      }));
    }

    var contentEl = $$('div').addClass('se-content');
    var contentEditor = $$(ContainerEditor, {
      disabled: this.props.disabled,
      node: node
    }).ref('contentEditor');
    contentEl.append(contentEditor);
    el.append(contentEl);

    return el;
  };
};

Component.extend(CaptionComponent);

module.exports = CaptionComponent;