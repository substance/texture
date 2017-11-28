import { registerSchema } from 'substance'
import TextureDocument from './TextureDocument'
import TextureJATS from './TextureJATS'
import TextureJATSImporter from './TextureJATSImporter'
import TextureHTMLConverters from './TextureHTMLConverters'

export default {
  name: 'TextureJATS',
  configure(config) {
    registerSchema(config, TextureJATS, TextureDocument)

    config.addImporter(TextureJATS.getName(), TextureJATSImporter)
    // enable rich-text support for clipboard
    TextureHTMLConverters.forEach((converter) => {
      config.addConverter('html', converter)
    })
  }
}
