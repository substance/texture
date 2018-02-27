import { registerSchema } from 'substance'
import TextureDocument from './TextureDocument'
import TextureArticle from './TextureArticle'
import TextureArticleImporter from './TextureArticleImporter'
import TextureHTMLConverters from './TextureHTMLConverters'

export default {
  name: 'TextureArticle',
  configure(config) {
    registerSchema(config, TextureArticle, TextureDocument)

    config.addImporter(TextureArticle.getName(), TextureArticleImporter)
    // enable rich-text support for clipboard
    TextureHTMLConverters.forEach((converter) => {
      config.addConverter('html', converter)
    })
  }
}
