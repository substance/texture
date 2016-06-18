'use strict';

var Annotation = require('substance/model/Annotation');

function Subscript() {
  Subscript.super.apply(this, arguments);
}

Annotation.extend(Subscript);

Subscript.static.name = 'subscript';

Subscript.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Subscript;
