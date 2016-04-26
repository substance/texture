'use strict';

var XMLExporter = require('substance/model/XMLExporter');
var converters = require('./nodes');

function JATSExporter() {
  JATSExporter.super.call(this, {
    converters: converters,
    containerId: 'main'
  });
}

JATSExporter.Prototype = function() {
  this.exportDocument = function(doc) {
    this.state.doc = doc;

    var articleEl = this.convertNode(doc.get('article'));
    return articleEl.outerHTML;
  };

  this.convertNodes = function(nodes) {
    var els = [];
    var converter = this;
    nodes.forEach(function(node) {
      els.push(converter.convertNode(node));
    });
    return els;
  };
};

XMLExporter.extend(JATSExporter);

module.exports = JATSExporter;
