import TextNode = from 'substance/model/TextNode'

class ArticleTitle extends TextNode {}

ArticleTitle.type = 'article-title'

ArticleTitle.define({
  attributes: { type: 'object', default: {} },
})

exports default ArticleTitle

