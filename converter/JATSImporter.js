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

  this._convertContainerElement = function(el, startPos) {
    var state = this.state;
    var nodes = [];
    state.pushContainer(nodes);
    var children = el.getChildren();
    startPos = startPos || 0;
    for (var i = startPos; i < children.length; i++) {
      state.lastContainer = null;
      var child = this.convertElement(children[i]);
      nodes.push(child.id);
      if (state.lastContainer) {
        Array.prototype.push.apply(nodes, state.lastContainer);
      }
      state.lastContainer = null;
    }
    state.popContainer();
    return nodes;
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

JATSImporter.converters = require('./nodes');


module.exports = JATSImporter;
