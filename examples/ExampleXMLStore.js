'use strict';

var oo = require('substance/util/oo');
var jQuery = require('jquery');

function ExampleXMLStore() {
  
}

ExampleXMLStore.Prototype = function() {
  this.readXML = function(documentId, cb) {
    jQuery.ajax('/data/'+documentId+'.xml', {
      dataType: 'text'
    })
    .done(function(data) {
      cb(null, data);
    }.bind(this))
    .fail(function(xhr, status, err) {
      cb(err);
    }.bind(this));
  };

  // TODO make functional
  this.writeXML = function(documentId, xml, cb) {
    cb(null);
  };
};

oo.initClass(ExampleXMLStore);

module.exports = ExampleXMLStore;
