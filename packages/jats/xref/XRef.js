'use strict';

var InlineNode = require('substance/model/InlineNode');
var Fragmenter = require('substance/model/Fragmenter');

function XRef() {
  XRef.super.apply(this, arguments);
}

InlineNode.extend(XRef);

XRef.type = 'xref';

XRef.defineSchema({
  attributes: { type: 'object', default: {} },
  targets: {type: ['id'], default: []},
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
  }
});

// In presence of overlapping annotations will try to render this as one element
XRef.static.fragmentation = Fragmenter.SHOULD_NOT_SPLIT;

module.exports = XRef;