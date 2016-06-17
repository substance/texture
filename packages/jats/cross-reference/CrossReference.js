'use strict';

var InlineNode = require('substance/model/InlineNode');

function CrossReference() {
  CrossReference.super.apply(this, arguments);
}

InlineNode.extend(CrossReference);

CrossReference.static.name = 'cross-reference';

CrossReference.static.defineSchema({
  attributes: { type: 'object',  default: {} },
  label: { type: 'text', optional: true }
});

Object.defineProperties(CrossReference.prototype, {
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

module.exports = CrossReference;