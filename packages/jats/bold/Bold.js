'use strict';

var Annotation = require('substance/model/Annotation');

function Bold() {
  Bold.super.apply(this, arguments);
}

Annotation.extend(Bold);

Bold.static.name = 'bold';

Bold.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = Bold;
