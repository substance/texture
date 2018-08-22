import { CompositeModel } from '../../kit'
import ReferenceCollectionModel from './ReferenceCollectionModel'

export default class BackMatterModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'references', model: new ReferenceCollectionModel(api) }
    )
  }

  get type () { return 'back-matter' }
}
