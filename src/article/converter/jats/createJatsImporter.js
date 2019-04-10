import { DocumentSchema } from 'substance'
import TextureConfigurator from '../../../TextureConfigurator'
import ArticlePlugin from '../../ArticlePlugin'
import InternalArticleDocument from '../../InternalArticleDocument'

// TODO: this is only needed for testing, so we should move this into test helpers
export default function createJatsImporter (doc) {
  let config = new TextureConfigurator()
  config.import(ArticlePlugin)
  let articleConfig = config.getConfiguration('article')
  if (!doc) {
    let schema = new DocumentSchema({
      DocumentClass: InternalArticleDocument,
      nodes: articleConfig.getNodes(),
      // TODO: try to get rid of this by using property schema
      defaultTextType: 'paragraph'
    })
    doc = InternalArticleDocument.createEmptyArticle(schema)
  }
  let importer = articleConfig.createImporter('jats', doc)
  return importer
}
