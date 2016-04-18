'use strict';

var extend = require('lodash/extend');
var XMLImporter = require('substance/model/XMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var ScientistArticle = require('../model/ScientistArticle');
var ScientistSchema = require('../model/ScientistSchema');

var ArticleConverter = require('./nodes/ArticleConverter');
var BodyConverter = require('./nodes/BodyConverter');
var ParagraphConverter = require('./nodes/ParagraphConverter');
var UnsupportedBlockNodeConverter = require('./nodes/UnsupportedBlockNodeConverter');
var UnsupportedInlineNodeConverter = require('./nodes/UnsupportedInlineNodeConverter');

function JATSImporter(config) {
  config = _getConfig();
  JATSImporter.super.call(this, config);
}

JATSImporter.Prototype = function() {

  this.importDocument = function(xmlString) {
    this.reset();
    var xmlDoc = DefaultDOMElement.parseXML(xmlString, 'fullDoc');
    var articleEl = xmlDoc.find('article');
    this.convertDocument(articleEl);
    var doc = this.generateDocument();
    return doc;
  };

  this.convertDocument = function(articleElement) {
    this.convertElement(articleElement);
  };

  this._createDocument = function() {
    return new ScientistArticle();
  };

};

XMLImporter.extend(JATSImporter);

function _getConfig(config) {
  var converters = [];
  if (config && config.converters) {
    converters = [];
  }
  converters = converters.concat(JATSImporter.converters);
  config = extend({}, config);
  config.converters = converters;
  config.schema = new ScientistSchema();
  return config;
}

JATSImporter.converters = [
  ArticleConverter,
  BodyConverter,
  ParagraphConverter,
  UnsupportedBlockNodeConverter,
  UnsupportedInlineNodeConverter
];

module.exports = JATSImporter;
