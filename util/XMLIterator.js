'use strict';

var oo = require('substance/util/oo');
var ArrayIterator = require('substance/util/ArrayIterator');
var makeMap = require('substance/util/makeMap');

function XMLIterator(elements) {
  this.it = new ArrayIterator(elements);
}

XMLIterator.Prototype = function() {

  this.optional = function(tagName, cb) {
    this._one(tagName, true, cb);
  };

  this.required = function(tagName, cb) {
    this._one(tagName, false, cb);
  };

  this._one = function(tagName, optional, cb) {
    if (this.it.hasNext()) {
      var el = this.it.next();
      if (el.tagName === tagName) {
        return cb(el);
      } else {
        this.it.back();
      }
    }
    if (!optional) throw new Error("Expecting element '"+ tagName +"'.");
  };

  this.manyOf = function(tagNames, cb) {
    tagNames = makeMap(tagNames);
    while(this.it.hasNext()) {
      var el = this.it.next();
      if (tagNames[el.tagName]) {
        cb(el);
      } else {
        this.it.back();
        break;
      }
    }
  };

  this.hasNext = function() {
    return this.it.hasNext();
  };

};

oo.initClass(XMLIterator);

module.exports = XMLIterator;