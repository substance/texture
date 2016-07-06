'use strict';

var Component = require('substance/ui/Component');
var renderNodeComponent = require('../../../util/renderNodeComponent');

/*
  Renders a keyboard-selectable figure target item
*/
function FigureTarget() {
  FigureTarget.super.apply(this, arguments);
}

FigureTarget.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();
    var el = $$('div')
      .addClass('sc-figure-target')
      .attr({'data-id': node.id});

    if (this.props.selected) {
      el.addClass('sm-selected');
    }

    // Render thumbnail
    el.append(
      this._renderThumb($$)
    );

    if (node.label) {
      var label = doc.get(node.label);
      el.append(
        renderNodeComponent(this, $$, label, {
          disabled: this.props.disabled
        })
      );
    }

    // Render first caption
    // TODO: Is there a way to cut off the caption to have a more compact view?
    var firstCaption = node.captions[0];

    if (firstCaption) {
      firstCaption = doc.get(firstCaption);
      el.append(
        renderNodeComponent(this, $$, firstCaption, {
          disabled: this.props.disabled
        })
      );
    }
    return el;
  };

  /*
    Render thumbnail based on the contents of the figure
  */
  this._renderThumb = function($$) {
    // For now we just pick the first content node (e.g. a graphic or a table)
    var node = this.props.node;
    var doc = node.getDocument();
    var firstContentNode = node.contentNodes[0];
    var el = $$('div').addClass('se-thumbnail');

    if (firstContentNode) {
      firstContentNode = doc.get(firstContentNode);
      el.append(renderNodeComponent(this, $$, firstContentNode));
    } else {
      el.append('No thumb');
    }
    return el;
  };
};

Component.extend(FigureTarget);

module.exports = FigureTarget;