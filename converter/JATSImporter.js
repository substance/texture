'use strict';

var extend = require('lodash/extend');
var isString = require('lodash/isString');
var isArray = require('lodash/isArray');
var last = require('lodash/last');
var DOMImporter = require('substance/model/DOMImporter');
var XMLImporter = require('substance/model/XMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var ScientistArticle = require('../model/ScientistArticle');
var ScientistSchema = require('../model/ScientistSchema');

var ArticleConverter = require('./nodes/ArticleConverter');
var FrontConverter = require('./nodes/FrontConverter');
var BodyConverter = require('./nodes/BodyConverter');

var SectionConverter = require('./nodes/SectionConverter');
var InlineFigureConverter = require('./nodes/InlineFigureConverter');
var CaptionConverter = require('./nodes/CaptionConverter');
var GraphicConverter = require('./nodes/GraphicConverter');
var EmphasisConverter = require('./nodes/EmphasisConverter');
var LinkConverter = require('./nodes/LinkConverter');
var StrongConverter = require('./nodes/StrongConverter');
var ParagraphConverter = require('./nodes/ParagraphConverter');
var UnsupportedBlockNodeConverter = require('./nodes/UnsupportedBlockNodeConverter');
var UnsupportedInlineNodeConverter = require('./nodes/UnsupportedInlineNodeConverter');

function JATSImporter(config) {
  config = _getConfig();
  JATSImporter.super.call(this, config);

  this.state = new JATSImporter.State();
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

  this._converterCanBeApplied = function(converter, el) {
    var currentContext = this.state.getCurrentElementContext();
    var allowedContext = converter.allowedContext;
    var matches = converter.matchElement(el);
    if (matches && currentContext && allowedContext) {
      var parentTagName = currentContext.tagName;
      if (isString(allowedContext)) {
        return (allowedContext === parentTagName);
      } else if (isArray(allowedContext)) {
        return (allowedContext.indexOf(parentTagName) > -1);
      }
    }
    return matches;
  };

  this._convertContainerElement = function(el, container, startPos) {
    var state = this.state;
    state.pushContainer(container);
    var childNodes = el.getChildNodes();
    startPos = startPos || 0;
    for (var i = startPos; i < childNodes.length; i++) {
      state.lastContainer = null;
      var child = this.convertElement(childNodes[i]);
      container.nodes.push(child.id);
      if (state.lastContainer) {
        container.nodes = container.nodes.concat(state.lastContainer.nodes);
      }
      state.lastContainer = null;
    }
    state.popContainer(container);
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

JATSImporter.State = function() {
  JATSImporter.State.super.call(this);
};

JATSImporter.State.Prototype = function() {

  var _super = JATSImporter.State.super.prototype;

  this.reset = function() {
    _super.reset.call(this);

    // stack for containers (body or sections)
    this.sectionLevel = 1;
    this.containers = [];
    // stack for list types
    this.lists = [];
    this.listItemLevel = 1;
  };

  // Support for nested elements which we decided to
  // model in a flattened way

  this.getCurrentSectionLevel = function() {
    return this.sectionLevel;
  };

  this.increaseSectionLevel = function() {
    return this.sectionLevel++;
  };

  this.decreaseSectionLevel = function() {
    return this.sectionLevel--;
  };

  this.getCurrentContainer = function() {
    return last(this.containers);
  };

  this.pushContainer = function(node) {
    return this.containers.push(node);
  };

  this.popContainer = function() {
    this.lastContainer = this.containers.pop();
  };

  this.getCurrentListItemLevel = function() {
    return this.listItemLevel;
  };

  this.increaseListItemLevel = function() {
    return this.listItemLevel++;
  };

  this.decreaseListItemLevel = function() {
    return this.listItemLevel--;
  };

  this.getCurrentList = function() {
    return last(this.lists);
  };
};

DOMImporter.State.extend(JATSImporter.State);

JATSImporter.converters = [
  ArticleConverter,
  FrontConverter,
  SectionConverter,
  InlineFigureConverter,
  CaptionConverter,
  GraphicConverter,
  EmphasisConverter,
  StrongConverter,
  LinkConverter,
  BodyConverter,
  ParagraphConverter,
  UnsupportedBlockNodeConverter,
  UnsupportedInlineNodeConverter
];

module.exports = JATSImporter;
