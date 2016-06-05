'use strict';

var Document = require('substance/model/Document');

function ScientistArticle(schema) {
  ScientistArticle.super.call(this, schema);
}

Document.extend(ScientistArticle);

module.exports = ScientistArticle;
