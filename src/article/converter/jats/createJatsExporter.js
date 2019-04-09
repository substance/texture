import TextureConfigurator from '../../../TextureConfigurator'
import ArticlePlugin from '../../ArticlePlugin'

// TODO: this is only needed for testing, so we should move this into test helpers
export default function createJatsExporter (jatsDom, doc) {
  let config = new TextureConfigurator()
  config.import(ArticlePlugin)
  let exporter = config.createExporter('jats', doc)
  return exporter
}
