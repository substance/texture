'use strict';

var oo = require('substance/util/oo');

var ScientistSaveHandler = function(context) {
  this.context = context;
};

ScientistSaveHandler.Prototype = function() {
  this.saveDocument = function(doc, changes, cb) {
    console.log('saving logic goes here');

    cb(null);
  };
};

oo.initClass(ScientistSaveHandler);

module.exports = ScientistSaveHandler;