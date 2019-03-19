import { DocumentNode, CHILD, CHILDREN, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

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
  footnotes: CHILDREN('footnote'),
  // EXPERIMENTAL: a translation has a link to the original content property
  // e.g. a translation for the article abstract points to 'article.abstract'
  // and has the same 'targetTypes' as the source property
  // FIXME: implement a UI for translations
  translations: CHILDREN('translation')
}
