import { DocumentNode, STRING, cloneDeep } from 'substance'
import Article from './Article'
import Abstract from './Abstract'

class Translation extends DocumentNode {
  getPath () {
    return [this.id, 'content']
  }
}
Translation.schema = {
  type: 'translation',
  language: STRING,
  source: { type: ['array', 'id'] }
}

export class ArticleTitleTranslation extends Translation {}
ArticleTitleTranslation.schema = {
  type: 'article-title-translation',
  content: cloneDeep(Article.schema.getProperty('title').definition)
}

export class ArticleAbstractTranslation extends Translation {}
ArticleAbstractTranslation.schema = {
  type: 'article-abstract-translation',
  content: cloneDeep(Abstract.schema.getProperty('content').definition)
}
