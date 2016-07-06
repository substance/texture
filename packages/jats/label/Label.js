'use strict';

var TextNode = require('substance/model/TextNode');

function Label() {
  Label.super.apply(this, arguments);
}

TextNode.extend(Label);

Label.static.name = 'label';

Label.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Label;