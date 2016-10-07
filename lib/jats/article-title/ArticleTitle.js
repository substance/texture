import { TextNode } from 'substance'

class ArticleTitle extends TextNode {}

ArticleTitle.type = 'article-title'

ArticleTitle.define({
  attributes: { type: 'object', default: {} }
})

export default ArticleTitle
