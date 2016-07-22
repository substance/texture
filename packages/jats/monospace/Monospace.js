'use strict';

var Annotation = require('substance/model/Annotation');

function Monospace() {
  Monospace.super.apply(this, arguments);
}

Annotation.extend(Monospace);

Monospace.type = 'monospace';

Monospace.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Monospace;
