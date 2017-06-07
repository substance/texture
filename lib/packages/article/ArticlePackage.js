import AbstractComponent from './AbstractComponent'
import ArticleComponent from './ArticleComponent'
import BodyComponent from './BodyComponent'
import SimpleFrontComponent from './SimpleFrontComponent'
import SimpleBackComponent from './SimpleBackComponent'
import TitleGroupComponent from './TitleGroupComponent'

export default {
  name: 'article',
  configure(config) {
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('article', ArticleComponent)
    config.addComponent('back', SimpleBackComponent)
    config.addComponent('body', BodyComponent)
    config.addComponent('front', SimpleFrontComponent)
    config.addComponent('title-group', TitleGroupComponent)
  },
  AbstractComponent,
  ArticleComponent,
  BodyComponent,
  SimpleBackComponent,
  SimpleFrontComponent,
  TitleGroupComponent
}