'use strict';

var oo = require('substance/util/oo');
var request = require('substance/util/request');

function ExampleXMLStore() {}

ExampleXMLStore.Prototype = function() {
  this.readXML = function(documentId, cb) {
    var cached = localStorage.getItem(documentId);
    if (cached) {
      return cb(null, cached);
    }
    request('GET', '../data/'+documentId+'.xml', null, cb);
  };

  // TODO make functional
  this.writeXML = function(documentId, xml, cb) {
    localStorage.setItem(documentId, xml);
    cb(null);
  };
};

oo.initClass(ExampleXMLStore);

module.exports = ExampleXMLStore;
