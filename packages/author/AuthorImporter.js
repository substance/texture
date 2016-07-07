'use strict';

var JATSImporter = require('../jats/JATSImporter');
var JATSTransformer = require('./JATSTransformer');

function AuthorImporter() {
  AuthorImporter.super.apply(this, arguments);
}

AuthorImporter.Prototype = function() {
  var _super = AuthorImporter.super.prototype;

  this.importDocument = function() {
    var doc = _super.importDocument.apply(this, arguments);
    var trafo = new JATSTransformer();
    doc = trafo.fromJATS(doc);
    return doc;
  };
};

JATSImporter.extend(AuthorImporter);

module.exports = AuthorImporter;