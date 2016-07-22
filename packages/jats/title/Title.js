'use strict';

var TextNode = require('substance/model/TextNode');

function Title() {
  Title.super.apply(this, arguments);
}

TextNode.extend(Title);

Title.type = 'title';

Title.define({
  attributes: { type: 'object', default: {} },
});

module.exports = Title;