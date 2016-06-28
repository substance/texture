'use strict';

var Component = require('substance/ui/Component');
var refToHTML = require('./refToHTML');

/*
  Renders a keyboard-selectable ref target item
*/
function RefTarget() {
  RefTarget.super.apply(this, arguments);
}

RefTarget.Prototype = function() {

  this.render = function($$) {
    var el = $$('div')
      .addClass('sc-ref-target')
      .attr({'data-id': this.props.node.id});

    if (this.props.selected) {
      el.addClass('sm-selected');
    }
    var node = this.props.node;
    el.html(refToHTML(node.xmlContent));
    return el;
  };
};

Component.extend(RefTarget);

module.exports = RefTarget;