'use strict';

import { Component, TextPropertyEditor } from 'substance'

function LabelComponent() {
  LabelComponent.super.apply(this, arguments);
}

LabelComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-label');
    var node = this.props.node;
    var labelEditor = $$(TextPropertyEditor, {
      disabled: this.props.disabled,
      path: node.getTextPath()
    }).ref('labelEditor');
    el.append(labelEditor);
    return el;
  };
};

Component.extend(LabelComponent);

export default LabelComponent;