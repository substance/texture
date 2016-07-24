'use strict';

var TextNode = require('substance/model/TextNode');

function ArticleTitle() {
  ArticleTitle.super.apply(this, arguments);
}

TextNode.extend(ArticleTitle);

ArticleTitle.type = 'article-title';

ArticleTitle.define({
  attributes: { type: 'object', default: {} },
});

module.exports = ArticleTitle;