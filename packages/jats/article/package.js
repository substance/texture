'use strict';

var ArticleNode = require('./ArticleNode');
var ArticleConverter = require('./ArticleConverter');
var TextureArticle = require('./TextureArticle');
var ArticleComponent = require('./ArticleComponent');

module.exports = {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'texture-article',
      ArticleClass: TextureArticle,
      defaultTextType: 'paragraph'
    });
    config.addNode(ArticleNode);
    config.addConverter('jats', ArticleConverter);
    config.addComponent(ArticleNode.type, ArticleComponent);
  }
};