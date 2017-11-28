import { registerSchema } from 'substance'
import TextureDocument from './TextureDocument'
import TextureJATS from './TextureJATS'
import TextureJATSImporter from './TextureJATSImporter'
import TextureHTMLConverters from './TextureHTMLConverters'
import { JournalArticle } from '../entities/EntityDatabase'


export default {
  name: 'TextureJATS',
  configure(config) {
    registerSchema(config, TextureJATS, TextureDocument)

    // We use this to store the list of authors, references, etc.
    config.addNode(JournalArticle)

    config.addImporter(TextureJATS.getName(), TextureJATSImporter)
    // enable rich-text support for clipboard
    TextureHTMLConverters.forEach((converter) => {
      config.addConverter('html', converter)
    })
  }
}
