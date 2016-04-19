'use strict';

var Container = require('substance/model/Container');

function ArticleNode() {
  ArticleNode.super.apply(this, arguments);
}

Container.extend(ArticleNode);

ArticleNode.static.name = "article";

/*
  Attributes
    article-type Type of Article
    dtd-version Version of the Tag Set (DTD)
    id Document Internal Identifier
    specific-use Specific Use
    xml:base Base
    xml:lang Language
    xmlns:ali NISO ALI Namespace (NISO Access License and Indicators)
    xmlns:mml MathML Namespace Declaration
    xmlns:xlink XLink Namespace Declaration
    xmlns:xsi XML Schema Namespace Declaration

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
