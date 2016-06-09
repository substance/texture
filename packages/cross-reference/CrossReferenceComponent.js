var InlineNodeComponent = require('substance/ui/InlineNodeComponent');

function CrossReferenceComponent() {
  CrossReferenceComponent.super.apply(this, arguments);
}

CrossReferenceComponent.Prototype = function() {

  var _super = CrossReferenceComponent.super.prototype;

  this.render = function($$) {
    var el = _super.render.call(this, $$);
    el.attr('data-id', this.props.node.id)
      .addClass('sc-reference sm-'+this.props.node.referenceType)
      .append(this.props.node.label || '');
    return el;
  };

};

InlineNodeComponent.extend(CrossReferenceComponent);

module.exports = CrossReferenceComponent;