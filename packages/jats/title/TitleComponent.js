'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');

function TitleComponent() {
  TitleComponent.super.apply(this, arguments);
}

TitleComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-title');
    var node = this.props.node;
    var titleEditor = $$(TextPropertyEditor, {
      disabled: this.props.disabled,
      path: node.getTextPath()
    }).ref('titleEditor');
    el.append(titleEditor);
    return el;
  };
};

Component.extend(TitleComponent);

module.exports = TitleComponent;