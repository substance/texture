import TextureConfigurator from '../TextureConfigurator'

export default class ArticleConfigurator extends TextureConfigurator {
  constructor (parent, name) {
    super(parent, name)

    // custom JATS schemas
    this._jatsVariants = new Map()
  }

  addJATSVariant (publicId, xmlSchema) {
    this._jatsVariants.set(publicId, xmlSchema)
  }

  getJATSVariant (publicId) {
    return this._jatsVariants.get(publicId)
  }
}
