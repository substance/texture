'use strict';

var Component = require('substance/ui/Component');
var refToHTML = require('./refToHTML');


function RefComponent() {
  RefComponent.super.apply(this, arguments);
}

RefComponent.Prototype = function() {
  this.render = function($$) {
    var el = $$('div').addClass('sc-ref');
    el.html(refToHTML(this.props.node));
    return el;
  };
};

Component.extend(RefComponent);

// Isolated Nodes config
RefComponent.fullWidth = true;
RefComponent.noStyle = true;

module.exports = RefComponent;
