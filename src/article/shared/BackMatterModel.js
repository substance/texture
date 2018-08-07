import CompositeModel from '../../shared/CompositeModel'
import ReferenceCollectionModel from '../models/ReferenceCollectionModel'

export default class BackMatterModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'references', model: new ReferenceCollectionModel(api) }
    )
  }

  get type () { return 'back-matter' }
}
