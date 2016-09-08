'use strict';

import { Component, ContainerEditor, TextPropertyEditor } from 'substance'

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
      })).ref('title');
    }

    var contentEl = $$('div').addClass('se-content');
    var contentEditor = $$(ContainerEditor, {
      disabled: this.props.disabled,
      node: node
    }).ref('content');
    contentEl.append(contentEditor);
    el.append(contentEl);

    return el;
  };
};

Component.extend(CaptionComponent);

export default CaptionComponent;
