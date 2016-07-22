'use strict';

var PropertyAnnotation = require('substance/model/PropertyAnnotation');
var Fragmenter = require('substance/model/Fragmenter');

function ExtLink() {
  ExtLink.super.apply(this, arguments);
}

PropertyAnnotation.extend(ExtLink);

ExtLink.type = "ext-link";

ExtLink.define({
  attributes: { type: 'object', default: {} },
});


// in presence of overlapping annotations will try to render this as one element
ExtLink.fragmentation = Fragmenter.SHOULD_NOT_SPLIT;

module.exports = ExtLink;
