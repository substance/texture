import TextureConfigurator from '../TextureConfigurator'

export default class ArticleConfigurator extends TextureConfigurator {
  constructor (parent, name) {
    super(parent, name)

    this._xmlSchemaIds = new Set()
    this._xmlValidators = new Map()
    this._xmlTransformations = new Map()

    this._customisations = new Map()
  }

  createCustomisation (xmlSchemaId) {
    this._xmlSchemaIds.add(xmlSchemaId)
  }

  // TODO: IMO this is not needed, because it is either a customisation
  // or covered via transformations
  registerSchemaId (xmlSchemaId) {
    this._xmlSchemaIds.add(xmlSchemaId)
  }

  isSchemaKnown (xmlSchemaId) {
    return this._xmlSchemaIds.has(xmlSchemaId)
  }

  addValidator (xmlSchemaId, validator) {
    this._xmlValidators.set(xmlSchemaId, validator)
  }

  getValidator (xmlSchemaId) {
    return this._xmlValidators.get(xmlSchemaId)
  }

  addTransformation (xmlSchemaId, transformation) {
    this._xmlTransformations.set(xmlSchemaId, transformation)
  }

  getTransformation (xmlSchemaId) {
    return this._xmlTransformations.get(xmlSchemaId)
  }
}
