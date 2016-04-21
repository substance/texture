'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');
var Paragraph = require('substance/packages/paragraph/ParagraphComponent');

function CaptionComponent() {
  Component.apply(this, arguments);
}

CaptionComponent.Prototype = function() {

  this.render = function($$) {
    var doc = this.props.node.getDocument();
    var el = $$('div')
      .addClass('sc-caption')
      .attr('data-id', this.props.node.id);

    el.append($$(TextProperty, {
      path: [ this.props.node.id, 'title']
    }));

    // Render caption content (0..n paragraphs)

    var contentEl = $$('div').addClass('se-content');
    this.props.node.contentNodes.forEach(function(paragraphId) {
      var node = doc.get(paragraphId);
      contentEl.append(
        $$(Paragraph, {
          doc: doc,
          node: node
        })
      );
    }.bind(this));

    return el;
  };
};

Component.extend(CaptionComponent);

module.exports = CaptionComponent;