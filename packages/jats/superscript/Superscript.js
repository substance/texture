'use strict';

var Annotation = require('substance/model/Annotation');

function Superscript() {
  Superscript.super.apply(this, arguments);
}

Annotation.extend(Superscript);

Superscript.static.name = 'superscript';

Superscript.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Superscript;
