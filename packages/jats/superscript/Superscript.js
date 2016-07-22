'use strict';

var Annotation = require('substance/model/Annotation');

function Superscript() {
  Superscript.super.apply(this, arguments);
}

Annotation.extend(Superscript);

Superscript.type = 'superscript';

Superscript.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Superscript;
