'use strict';

var Container = require('substance/model/Container');

function ArticleNode() {
  ArticleNode.super.apply(this, arguments);
}

Container.extend(ArticleNode);

ArticleNode.static.name = "article";

module.exports = ArticleNode;
