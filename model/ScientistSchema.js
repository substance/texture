'use strict';

var DocumentSchema = require('substance/model/DocumentSchema');

var ArticleNode = require('./nodes/ArticleNode');
var Front = require('./nodes/Front');
var Body = require('./nodes/Body');
var Paragraph = require('substance/packages/paragraph/Paragraph');
var Emphasis = require('substance/packages/emphasis/Emphasis');
var Strong = require('substance/packages/strong/Strong');
var Link = require('substance/packages/link/Link');
var Heading = require('substance/packages/heading/Heading');
var Reference = require('./nodes/Reference');
var Caption = require('./nodes/Caption');
var Graphic = require('./nodes/Graphic');
var InlineFigure = require('./nodes/InlineFigure');
var UnsupportedBlockNode = require('./nodes/UnsupportedBlockNode');
var UnsupportedInlineNode = require('./nodes/UnsupportedInlineNode');

function ScientistSchema() {
  ScientistSchema.super.call(this);
  this.addNodes(ScientistSchema.nodes);
}

ScientistSchema.Prototype = function() {
  this.getDefaultTextType = function() {
    return 'paragraph';
  };
};

DocumentSchema.extend(ScientistSchema);

ScientistSchema.nodes = [
  ArticleNode,
  Front,
  Body,
  Paragraph,
  Heading,
  Emphasis,
  Strong,
  Link,
  Reference,
  InlineFigure,
  Graphic,
  Caption,
  UnsupportedBlockNode,
  UnsupportedInlineNode
];

module.exports = ScientistSchema;
