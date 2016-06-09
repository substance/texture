'use strict';

var Component = require('substance/ui/Component');

function CrossReferenceComponent() {
  CrossReferenceComponent.super.apply(this, arguments);
}

CrossReferenceComponent.Prototype = function() {

  var _super = CrossReferenceComponent.super.prototype;

  this.render = function($$) {
    var el = $$('span');
    el.attr('data-id', this.props.node.id)
      .addClass('sc-reference sm-'+this.props.node.referenceType)
      .append(this.props.node.label || '');
    return el;
  };

};

Component.extend(CrossReferenceComponent);

module.exports = CrossReferenceComponent;