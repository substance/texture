'use strict';

var PropertyAnnotation = require('substance/model/PropertyAnnotation');
var Fragmenter = require('substance/model/Fragmenter');

function XRef() {
  XRef.super.apply(this, arguments);
}

PropertyAnnotation.extend(XRef);

XRef.static.name = 'xref';

XRef.static.defineSchema({
  attributes: { type: 'object', default: {} },
  label: { type: 'text', optional: true }
});

Object.defineProperties(XRef.prototype, {
  referenceType: {
    get: function() {
      return this.attributes['ref-type'];
    },
    set: function(refType) {
      this.attributes['ref-type'] = refType;
    }
  },
  target: {
    get: function() {
      return this.attributes['rid'];
    },
    set: function(rid) {
      this.attributes['rid'] = rid;
    }
  }
});

// in presence of overlapping annotations will try to render this as one element
XRef.static.fragmentation = Fragmenter.SHOULD_NOT_SPLIT;

module.exports = XRef;