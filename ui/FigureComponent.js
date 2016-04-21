'use strict';

var Component = require('substance/ui/Component');
var TextProperty = require('substance/ui/TextPropertyComponent');

function FigureComponent() {
  Component.apply(this, arguments);
}

FigureComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('div')
      .addClass('sc-figure')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append($$(TextProperty, {
        path: [ this.props.node.id, 'label']
      }));

    // Display figure content
    el.append(
      $$('div').addClass('se-figure-content').append(
        'FIGURE_CONTENT'
      )
    );

    return el;
  };
};

Component.extend(FigureComponent);

module.exports = FigureComponent;