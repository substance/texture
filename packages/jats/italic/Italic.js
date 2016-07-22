'use strict';

var Annotation = require('substance/model/Annotation');

function Italic() {
  Italic.super.apply(this, arguments);
}

Annotation.extend(Italic);

Italic.type = 'italic';

Italic.define({
  attributes: { type: 'object', default: {} },
});

module.exports = Italic;
