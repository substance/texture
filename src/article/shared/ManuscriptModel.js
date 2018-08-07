import CompositeModel from '../../shared/CompositeModel'
import FrontMatterModel from './FrontMatterModel'
import BackMatterModel from './BackMatterModel'

export default class ManuscriptModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'front', model: new FrontMatterModel(api) },
      { name: 'body', model: api.getArticleBody() },
      { name: 'back', model: new BackMatterModel(api) }
    )
  }

  get type () { return 'manuscript' }
}
