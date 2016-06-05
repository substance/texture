'use strict';

var ArticleNode = require('./ArticleNode');
var ArticleConverter = require('./ArticleConverter');
var ScientistArticle = require('./ScientistArticle');
var JATSImporter = require('./JATSImporter');
var JATSExporter = require('./JATSExporter');

module.exports = {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'scientist-article',
      ArticleClass: ScientistArticle,
      defaultTextType: 'paragraph'
    });

    config.addNode(ArticleNode);
    config.addConverter('jats', ArticleConverter);

    config.addImporter('jats', JATSImporter);
    config.addExporter('jats', JATSExporter);
  }
};