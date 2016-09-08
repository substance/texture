'use strict';

import { Component, ContainerEditor, TextPropertyEditor } from 'substance'

function SectionComponent() {
  SectionComponent.super.apply(this, arguments);
}

SectionComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();
    var el = $$('div').addClass('sc-section');

    if (node.title) {
      var title = doc.get(node.title);
      el.append(
        $$(TextPropertyEditor, { path: title.getTextPath() }).addClass('se-title').ref('titleEditor')
      );
    }
    el.append(
      $$(ContainerEditor, { node: node }).ref('contentEditor')
        .addClass('se-content')
    );
    return el;
  };

};

Component.extend(SectionComponent);

SectionComponent.fullWidth = true;
SectionComponent.noStyle = true;

export default SectionComponent;
