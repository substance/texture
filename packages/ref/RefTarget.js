'use strict';

var Component = require('substance/ui/Component');

/*
  Renders a keyboard-selectable ref target item
*/
function RefTarget() {
  RefTarget.super.apply(this, arguments);
}

RefTarget.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-ref-target');
    var node = this.props.node;

    el.innerHTML = node.xmlContent;
    return el;
  };
};

Component.extend(RefTarget);

module.exports = RefTarget;