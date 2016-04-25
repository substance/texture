var InlineNodeComponent = require('substance/ui/InlineNodeComponent');


function ReferenceComponent() {
  ReferenceComponent.super.apply(this, arguments);
}

ReferenceComponent.Prototype = function() {

  var _super = ReferenceComponent.super.prototype;

  this.render = function($$) {
    var el = _super.render.call(this, $$);
    el.attr('data-id', this.props.node.id)
      .addClass('sc-reference sm-'+this.props.node.referenceType)
      .append(this.props.node.label || '');

    return el;
  };

};

InlineNodeComponent.extend(ReferenceComponent);

module.exports = ReferenceComponent;