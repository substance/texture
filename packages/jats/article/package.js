'use strict';

var ArticleNode = require('./ArticleNode');
var ArticleConverter = require('./ArticleConverter');
var ScientistArticle = require('./ScientistArticle');
var ArticleComponent = require('./ArticleComponent');

module.exports = {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'scientist-article',
      ArticleClass: ScientistArticle,
      defaultTextType: 'paragraph'
    });

    config.addStyle(__dirname, '_article.scss');
    config.addNode(ArticleNode);
    config.addConverter('jats', ArticleConverter);
    config.addComponent(ArticleNode.type, ArticleComponent);
  }
};