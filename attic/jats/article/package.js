import ArticleNode from './ArticleNode'
import ArticleConverter from './ArticleConverter'
import TextureArticle from './TextureArticle'
import ArticleComponent from './ArticleComponent'

export default {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'texture-article',
      ArticleClass: TextureArticle,
      defaultTextType: 'paragraph'
    })
    config.addNode(ArticleNode)
    config.addConverter('jats', ArticleConverter)
    config.addComponent(ArticleNode.type, ArticleComponent)
  }
}
