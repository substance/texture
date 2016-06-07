'use strict';

var isString = require('lodash/isString');
var isArray = require('lodash/isArray');
var last = require('lodash/last');
var DOMImporter = require('substance/model/DOMImporter');
var XMLImporter = require('substance/model/XMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var UnsupportedNodeJATSConverter = require('../unsupported/UnsupportedNodeJATSConverter');
var inBrowser = require('substance/util/inBrowser');

function JATSImporter(config) {
  JATSImporter.super.call(this, config);
  this.state = new JATSImporter.State();
}

JATSImporter.Prototype = function() {

  this.importDocument = function(xmlString) {
    this.reset();
    var xmlDoc = DefaultDOMElement.parseXML(xmlString, 'fullDoc');
    // HACK: server side impl gives an array
    var articleEl;
    if (inBrowser) {
      articleEl = xmlDoc.find('article');
    } else {
      // HACK: this should be more convenient
      for (var idx = 0; idx < xmlDoc.length; idx++) {
        if (xmlDoc[idx].tagName === 'article') {
          articleEl = xmlDoc[idx];
        }
      }
    }
    this.convertDocument(articleEl);
    var doc = this.generateDocument();
    return doc;
  };

  this.convertDocument = function(articleElement) {
    this.convertElement(articleElement);
  };

  this.convertElements = function(elements, startIdx, endIdx) {
    if (arguments.length < 2) {
      startIdx = 0;
    }
    if(arguments.length < 3) {
      endIdx = elements.length;
    }
    var nodes = [];
    for (var i = startIdx; i < endIdx; i++) {
      nodes.push(this.convertElement(elements[i]));
    }
    return nodes;
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

  this._getUnsupportedNodeConverter = function() {
    return UnsupportedNodeJATSConverter;
  };

};

XMLImporter.extend(JATSImporter);

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

module.exports = JATSImporter;
