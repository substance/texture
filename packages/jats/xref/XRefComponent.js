'use strict';

var AnnotationComponent = require('substance/ui/AnnotationComponent');

function XRefComponent() {
  XRefComponent.super.apply(this, arguments);
}

XRefComponent.Prototype = function() {

  var _super = XRefComponent.super.prototype;

  this.render = function($$) { // eslint-disable-line
    var el = _super.render.apply(this, arguments);
    el.addClass('sm-'+this.props.node.referenceType);
    return el;
  };
};

AnnotationComponent.extend(XRefComponent);

module.exports = XRefComponent;
