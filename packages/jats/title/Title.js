'use strict';

var TextNode = require('substance/model/TextNode');

function Title() {
  Title.super.apply(this, arguments);
}

TextNode.extend(Title);

Title.static.name = 'title';

Title.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Title;