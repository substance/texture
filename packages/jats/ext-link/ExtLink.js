'use strict';

var PropertyAnnotation = require('substance/model/PropertyAnnotation');
var Fragmenter = require('substance/model/Fragmenter');

function Link() {
  Link.super.apply(this, arguments);
}

PropertyAnnotation.extend(Link);

Link.static.name = "ext-link";

Link.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

// in presence of overlapping annotations will try to render this as one element
Link.static.fragmentation = Fragmenter.SHOULD_NOT_SPLIT;

module.exports = Link;
