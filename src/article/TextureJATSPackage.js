import { registerSchema } from 'substance'
import TextureDocument from './TextureDocument'
import TextureJATS from './TextureJATS'
import TextureJATSImporter from './TextureJATSImporter'

export default {
  name: 'TextureJATS',
  configure(config) {
    registerSchema(config, TextureJATS, TextureDocument)
    config.addImporter(TextureJATS.getName(), TextureJATSImporter)
  }
}
