'use strict';

var ArticleTitle = require('./ArticleTitle');
var ArticleTitleConverter = require('./ArticleTitleConverter');
var ArticleTitleComponent = require('./ArticleTitleComponent');

module.exports = {
  name: 'article-title',
  configure: function(config) {
    config.addNode(ArticleTitle);
    config.addComponent(ArticleTitle.type, ArticleTitleComponent);
    config.addConverter('jats', ArticleTitleConverter);
    config.addStyle(__dirname, '_article-title.scss');
  }
};
