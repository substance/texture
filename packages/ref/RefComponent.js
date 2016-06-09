'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');

function RefComponent() {
  RefComponent.super.apply(this, arguments);
}

RefComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-ref');
    el.innerHTML = this.props.node.xmlContent;
    return el;
  };
};

Component.extend(RefComponent);

// Isolated Nodes config
RefComponent.static.fullWidth = true;
RefComponent.static.noStyle = true;

module.exports = RefComponent;
