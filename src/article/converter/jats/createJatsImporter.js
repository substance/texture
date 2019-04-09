import TextureConfigurator from '../../../TextureConfigurator'
import ArticlePlugin from '../../ArticlePlugin'

// TODO: this is only needed for testing, so we should move this into test helpers
export default function createJatsImporter (doc) {
  let config = new TextureConfigurator()
  config.import(ArticlePlugin)
  let importer = config.createImporter('jats', doc)
  return importer
}
