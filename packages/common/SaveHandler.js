'use strict';

var oo = require('substance/util/oo');

var ScientistSaveHandler = function(context) {
  this.context = context;
};

ScientistSaveHandler.Prototype = function() {
  this.saveDocument = function(doc, changes, cb) {
    var exporter = this.context.exporter;
    var xml = exporter.exportDocument(doc);
    // console.log('### SAVING XML', xml);
    this.context.xmlStore.writeXML('elife-00007', xml, cb);
  };
};

oo.initClass(ScientistSaveHandler);

module.exports = ScientistSaveHandler;
