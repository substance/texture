'use strict';

var TextBlock = require('substance/model/TextBlock');

function HeadingNode() {
  HeadingNode.super.apply(this, arguments);
}

TextBlock.extend(HeadingNode);

HeadingNode.static.name = "heading";

HeadingNode.static.defineSchema({
  // just a reference to the original node
  // which will be used to retain XML attributes
  sectionId: { type: 'id', optional: true },
  level: { type: "number", default: 1 },
});

module.exports = HeadingNode;
