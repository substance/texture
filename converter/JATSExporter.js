'use strict';

var XMLExporter = require('substance/model/XMLExporter');
var converters = require('./JATSImporter').converters;
// var each = require('lodash/collection/each');

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
};

XMLExporter.extend(JATSExporter);

module.exports = JATSExporter;
