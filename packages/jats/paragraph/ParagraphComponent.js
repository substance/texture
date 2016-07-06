'use strict';

var TextBlockComponent = require('substance/ui/TextBlockComponent');

function ParagraphComponent() {
  ParagraphComponent.super.apply(this, arguments);
}

ParagraphComponent.Prototype = function() {

  this.getClassNames = function() {
    return 'sc-paragraph';
  };

};

TextBlockComponent.extend(ParagraphComponent);

module.exports = ParagraphComponent;
