var ArticleConverter = require('./ArticleConverter');
var FrontConverter = require('./FrontConverter');
var BodyConverter = require('./BodyConverter');
var SectionConverter = require('./SectionConverter');
var FigureConverter = require('./FigureConverter');
var TableWrapConverter = require('./TableWrapConverter');
var TableConverter = require('./TableConverter');
var CaptionConverter = require('./CaptionConverter');
var GraphicConverter = require('./GraphicConverter');
var ReferenceConverter = require('./ReferenceConverter');
var EmphasisConverter = require('./EmphasisConverter');
var SuperscriptConverter = require('./SuperscriptConverter');
var SubscriptConverter = require('./SubscriptConverter');
var LinkConverter = require('./LinkConverter');
var StrongConverter = require('./StrongConverter');
var ParagraphConverter = require('./ParagraphConverter');
var UnsupportedNodeConverter = require('./UnsupportedNodeConverter');

module.exports = [
  ArticleConverter,
  FrontConverter,
  SectionConverter,
  FigureConverter,
  TableWrapConverter,
  TableConverter,
  CaptionConverter,
  GraphicConverter,
  ReferenceConverter,
  EmphasisConverter,
  SuperscriptConverter,
  SubscriptConverter,
  StrongConverter,
  LinkConverter,
  BodyConverter,
  ParagraphConverter
];