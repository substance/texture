'use strict';

var DocumentSchema = require('substance/model/DocumentSchema');

var ArticleNode = require('./nodes/ArticleNode');
var Front = require('./nodes/Front');
var Body = require('./nodes/Body');
var Paragraph = require('substance/packages/paragraph/Paragraph');
var Emphasis = require('substance/packages/emphasis/Emphasis');
var Strong = require('substance/packages/strong/Strong');
var Code = require('substance/packages/code/Code');
var Superscript = require('substance/packages/superscript/Superscript');
var Subscript = require('substance/packages/subscript/Subscript');
var Link = require('substance/packages/link/Link');
var Heading = require('substance/packages/heading/Heading');
var Reference = require('./nodes/Reference');
var Caption = require('./nodes/Caption');
var Graphic = require('./nodes/Graphic');
var Figure = require('./nodes/Figure');
var TableWrap = require('./nodes/TableWrap');
var Table = require('./nodes/Table');
var UnsupportedNode = require('./nodes/UnsupportedNode');

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
  Code,
  Superscript,
  Subscript,
  Link,
  Reference,
  Figure,
  TableWrap, Table,
  Graphic,
  Caption,
  UnsupportedNode
];

module.exports = ScientistSchema;
