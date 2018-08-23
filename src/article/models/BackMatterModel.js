import { CompositeModel } from '../../kit'

export default class BackMatterModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'references', model: api.getModelById('references') }
    )
  }

  get type () { return 'back-matter' }
}
