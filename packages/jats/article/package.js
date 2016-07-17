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
    config.addConverter('jats', ArticleConverter)
    config.addComponent(ArticleNode.static.name, ArticleComponent)
  }
}
