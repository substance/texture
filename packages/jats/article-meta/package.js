'use strict';

var ArticleMeta = require('./ArticleMeta');
var ArticleMetaConverter = require('./ArticleMetaConverter');
var ArticleMetaComponent = require('./ArticleMetaComponent');

module.exports = {
  name: 'article-meta',
  configure: function(config) {
    config.addNode(ArticleMeta);
    config.addConverter('jats', ArticleMetaConverter);
    config.addComponent(ArticleMeta.type, ArticleMetaComponent);
  }
};
