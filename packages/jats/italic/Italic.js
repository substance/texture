'use strict';

var Annotation = require('substance/model/Annotation');

function Italic() {
  Italic.super.apply(this, arguments);
}

Annotation.extend(Italic);

Italic.static.name = 'italic';

Italic.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Italic;
