'use strict';

var DocumentSchema = require('substance/model/DocumentSchema');

var ArticleNode = require('./nodes/ArticleNode');
var Front = require('./nodes/Front');
var Body = require('./nodes/Body');
var Paragraph = require('substance/packages/paragraph/Paragraph');
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
  UnsupportedBlockNode,
  UnsupportedInlineNode
];

module.exports = ScientistSchema;
