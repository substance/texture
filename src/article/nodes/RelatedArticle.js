import { DocumentNode, STRING } from 'substance';

export default class RelatedArticle extends DocumentNode {}

RelatedArticle.schema = {
  type: 'related-article',
  extLinkType: STRING,
  id: STRING,
  relatedArticleType: STRING,
  href: STRING
};
