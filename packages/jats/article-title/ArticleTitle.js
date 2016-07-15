'use strict';

var TextNode = require('substance/model/TextNode');

function ArticleTitle() {
  ArticleTitle.super.apply(this, arguments);
}

TextNode.extend(ArticleTitle);

ArticleTitle.static.name = 'article-title';

ArticleTitle.static.defineSchema({
  attributes: { type: 'object', default: {} },
});

module.exports = ArticleTitle;