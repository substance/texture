'use strict';

var JATSExporter = require('../jats/JATSExporter');
var JATSTransformer = require('./JATSTransformer');

function AuthorExporter() {
  AuthorExporter.super.apply(this, arguments);
}

AuthorExporter.Prototype = function() {
  var _super = AuthorExporter.super.prototype;

  this.exportDocument = function(doc) {
    var trafo = new JATSTransformer();
    doc = trafo.toJATS(doc);
    return _super.exportDocument.call(this, doc);
  };
};

JATSExporter.extend(AuthorExporter);

module.exports = AuthorExporter;
