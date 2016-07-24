'use strict';

var Annotation = require('substance/model/Annotation');

function Monospace() {
  Monospace.super.apply(this, arguments);
}

Annotation.extend(Monospace);

Monospace.type = 'monospace';

Monospace.define({
  attributes: { type: 'object', default: {} },
});

module.exports = Monospace;
