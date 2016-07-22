import ArticleNode from './ArticleNode'
import ArticleConverter from './ArticleConverter'
import ScientistArticle from './ScientistArticle'
import ArticleComponent from './ArticleComponent'

export default {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'scientist-article',
      ArticleClass: ScientistArticle,
      defaultTextType: 'paragraph'
    })
    config.addNode(ArticleNode)
    config.addComponent(ArticleNode.type, ArticleComponent)
    config.addConverter('jats', ArticleConverter)
  }
}
