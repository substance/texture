'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');

function XRefComponent() {
  XRefComponent.super.apply(this, arguments);
}

XRefComponent.Prototype = function() {

  this.render = function($$) { // eslint-disable-line
    var node = this.props.node;
    var el = $$('span').addClass('sc-xref');

    var labelEditor = $$(TextPropertyEditor, {
      disabled: this.props.disabled,
      tagName: 'span',
      path: [node.id, 'label'],
      withoutBreak: true
    }).ref('labelEditor');
    el.append(labelEditor);

    el.addClass('sm-'+node.referenceType);
    return el;
  };
};

Component.extend(XRefComponent);

module.exports = XRefComponent;