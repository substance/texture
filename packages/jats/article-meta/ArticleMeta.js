'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function ArticleMeta() {
  ArticleMeta.super.apply(this, arguments);
}

DocumentNode.extend(ArticleMeta);

ArticleMeta.type = 'article-meta';

ArticleMeta.define({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});

module.exports = ArticleMeta;
