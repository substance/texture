import { DocumentNode, CHILD, CHILDREN, TEXT } from 'substance';
import { RICH_TEXT_ANNOS } from './modelConstants';

export default class Article extends DocumentNode {}
Article.schema = {
  type: 'article',
  metadata: CHILD('metadata'),
  title: TEXT(RICH_TEXT_ANNOS),
  subTitle: TEXT(RICH_TEXT_ANNOS),
  abstract: CHILD('abstract'),
  customAbstracts: CHILDREN('custom-abstract'),
  body: CHILD('body'),
  references: CHILDREN('reference'),
  relatedArticles: CHILDREN('related-article'),
  acknowledgements: CHILDREN('acknowledgement'),
  footnotes: CHILDREN('footnote')
};
