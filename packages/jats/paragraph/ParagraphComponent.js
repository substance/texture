'use strict';

import { TextBlockComponent } from 'substance'

function ParagraphComponent() {
  ParagraphComponent.super.apply(this, arguments);
}

ParagraphComponent.Prototype = function() {

  this.getClassNames = function() {
    return 'sc-paragraph';
  };

};

TextBlockComponent.extend(ParagraphComponent);

export default ParagraphComponent;
