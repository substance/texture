'use strict';

var Document = require('substance/model/Document');
var ScientistSchema = require('./ScientistSchema');

function Article() {
  Article.super.call(this, new ScientistSchema());
}

Document.extend(Article);

module.exports = Article;
