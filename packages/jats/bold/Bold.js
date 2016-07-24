'use strict';

var Annotation = require('substance/model/Annotation');

function Bold() {
  Bold.super.apply(this, arguments);
}

Annotation.extend(Bold);

Bold.type = 'bold';

Bold.define({
  attributes: { type: 'object', default: {} },
});

module.exports = Bold;
