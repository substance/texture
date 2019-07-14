import TextureConfigurator from '../../../TextureConfigurator'
import ArticlePackage from '../../ArticlePackage'

// TODO: this is only needed for testing, so we should move this into test helpers
export default function createJatsExporter (jatsDom, doc) {
  let config = new TextureConfigurator()
  config.import(ArticlePackage)
  let articleConfig = config.getConfiguration('article')
  let exporter = articleConfig.createExporter('jats')
  return exporter
}
