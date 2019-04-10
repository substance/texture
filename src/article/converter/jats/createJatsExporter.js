import TextureConfigurator from '../../../TextureConfigurator'
import ArticlePlugin from '../../ArticlePlugin'

// TODO: this is only needed for testing, so we should move this into test helpers
export default function createJatsExporter (jatsDom, doc) {
  let config = new TextureConfigurator()
  config.import(ArticlePlugin)
  let articleConfig = config.getConfiguration('article')
  let exporter = articleConfig.createExporter('jats', doc)
  return exporter
}
