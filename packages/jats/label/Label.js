'use strict';

var TextNode = require('substance/model/TextNode');

function Label() {
  Label.super.apply(this, arguments);
}

TextNode.extend(Label);

Label.type = 'label';

Label.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Label;