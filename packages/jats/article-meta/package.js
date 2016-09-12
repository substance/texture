'use strict';

import ArticleMeta from './ArticleMeta'
import ArticleMetaConverter from './ArticleMetaConverter'
import ArticleMetaComponent from './ArticleMetaComponent'

export default {
  name: 'article-meta',
  configure: function(config) {
    config.addNode(ArticleMeta);
    config.addConverter('jats', ArticleMetaConverter);
    config.addComponent(ArticleMeta.type, ArticleMetaComponent);
  }
};
