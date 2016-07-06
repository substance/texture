'use strict';

var last = require('lodash/last');
var DOMImporter = require('substance/model/DOMImporter');
var XMLImporter = require('substance/model/XMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var UnsupportedNodeJATSConverter = require('../unsupported/UnsupportedNodeJATSConverter');
var inBrowser = require('substance/util/inBrowser');

function JATSImporter(config) {
  config.enableInlineWrapper = true;
  JATSImporter.super.call(this, config);
  this.state = new JATSImporter.State();
}

JATSImporter.Prototype = function() {

  var _super = JATSImporter.super.prototype;

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
    return converter.matchElement(el, this);
  };

  this._getUnsupportedNodeConverter = function() {
    return UnsupportedNodeJATSConverter;
  };

  this._nodeData = function(el) {
    var nodeData = _super._nodeData.apply(this, arguments);
    nodeData.attributes = el.getAttributes();
    return nodeData;
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
    // stack for list types
    this.lists = [];
    this.listItemLevel = 1;
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
