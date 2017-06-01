import ArticleComponent from './ArticleComponent'
import SimpleFrontComponent from './SimpleFrontComponent'
import SimpleBackComponent from './SimpleBackComponent'

export default {
  name: 'article',
  configure(config) {
    config.addComponent('article', ArticleComponent)
    config.addComponent('front', SimpleFrontComponent)
    config.addComponent('back', SimpleBackComponent)
  },
  ArticleComponent,
  SimpleFrontComponent,
  SimpleBackComponent
}