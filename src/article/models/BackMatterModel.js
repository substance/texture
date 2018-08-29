import { CompositeModel } from '../../kit'

export default class BackMatterModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'footnotes', model: api.getModelById('footnotes') },
      { name: 'references', model: api.getModelById('references') }
    )
  }

  get type () { return 'back-matter' }
}
