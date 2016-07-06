'use strict';

var oo = require('substance/util/oo');

function SaveHandler(context) {
  this.context = context;
}

SaveHandler.Prototype = function() {
  this.saveDocument = function(doc, changes, cb) {
    var exporter = this.context.exporter;
    var xml = exporter.exportDocument(doc);
    // console.log('### SAVING XML', xml);
    this.context.xmlStore.writeXML(this.context.documentId, xml, cb);
  };
};

oo.initClass(SaveHandler);

module.exports = SaveHandler;
