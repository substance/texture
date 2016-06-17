'use strict';

var XMLExporter = require('substance/model/XMLExporter');

function JATSExporter(config) {
  JATSExporter.super.call(this, config);
}

JATSExporter.Prototype = function() {

  var _super = JATSExporter.super.prototype;

  this.exportDocument = function(doc) {
    this.state.doc = doc;

    var articleEl = this.convertNode(doc.get('article'));
    return articleEl.outerHTML;
  };

  this.convertNode = function(node) {
    var el = _super.convertNode.apply(this, arguments);
    el.attr(node.attributes);
    return el;
  };

  this.convertNodes = function(nodes) {
    var els = [];
    var converter = this;
    if (nodes._isArrayIterator) {
      while(nodes.hasNext()) {
        els.push(converter.convertNode(nodes.next()));
      }
    } else {
      nodes.forEach(function(node) {
        els.push(converter.convertNode(node));
      });
    }
    return els;
  };
};

XMLExporter.extend(JATSExporter);

module.exports = JATSExporter;
