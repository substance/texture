'use strict';

var AnnotationComponent = require('substance/ui/AnnotationComponent');

function ExtLinkComponent() {
  ExtLinkComponent.super.apply(this, arguments);
}

ExtLinkComponent.Prototype = function() {

  var _super = ExtLinkComponent.super.prototype;

  this.didMount = function() {
    _super.didMount.apply(this, arguments);

    var node = this.props.node;
    node.on('properties:changed', this.rerender, this);
  };

  this.dispose = function() {
    _super.dispose.apply(this, arguments);

    var node = this.props.node;
    node.off(this);
  };

  this.render = function($$) { // eslint-disable-line
    var node = this.props.node;
    var el = _super.render.apply(this, arguments);

    el.tagName = 'a';
    el.attr('href', node.attributes['xlink:href']);

    return el;
  };

};

AnnotationComponent.extend(ExtLinkComponent);

module.exports = ExtLinkComponent;
