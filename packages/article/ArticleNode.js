'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function ArticleNode() {
  ArticleNode.super.apply(this, arguments);
}

DocumentNode.extend(ArticleNode);

ArticleNode.static.name = 'article';

/*
  Content Model
    (front, body?, back?, floats-group?, (sub-article* | response*))
*/

ArticleNode.static.defineSchema({
  xmlAttributes: { type: 'object',  default: {} },
  front: { type: 'id' },
  body: { type: 'id', optional: true },
  back: { type: 'id', optional: true },
  floats: { type: 'id', optional: true },
  subArticles: { type: ['id'], optional: true },
  responses: { type: ['id'], optional: true },
});

module.exports = ArticleNode;
