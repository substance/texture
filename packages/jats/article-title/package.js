'use strict';

var ArticleTitle = require('./ArticleTitle');
var ArticleTitleConverter = require('./ArticleTitleConverter');
var ArticleTitleComponent = require('./ArticleTitleComponent');

module.exports = {
  name: 'article-title',
  configure: function(config) {
    config.addNode(ArticleTitle);
    config.addConverter('jats', ArticleTitleConverter);
    config.addComponent(ArticleTitle.type, ArticleTitleComponent);
    config.addStyle(__dirname, '_article-title.scss');
  }
};
