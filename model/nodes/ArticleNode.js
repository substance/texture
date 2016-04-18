'use strict';

var Container = require('substance/model/Container');

function ArticleNode() {
  ArticleNode.super.apply(this, arguments);
}

Container.extend(ArticleNode);

ArticleNode.static.name = "article";

/*
  Content Model
    (front, body?, back?, floats-group?, (sub-article* | response*))
*/
ArticleNode.static.defineSchema({
  front: { type: 'id' },
  body: { type: 'id', optional: true },
  back: { type: 'id', optional: true },
  floats: { type: 'id', optional: true },
  subArticles: { type: ['id'], default: [] },
  responses: { type: ['id'], default: [] },
});

module.exports = ArticleNode;
