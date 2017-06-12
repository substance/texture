import { registerSchema } from 'substance'
import TextureDocument from './TextureDocument'
import TextureJATS from './jats/TextureJATS'
import TextureJATSImporter from './document/TextureJATSImporter'

export default {
  name: 'TextureJATS',
  configure(config) {
    registerSchema(config, TextureJATS, TextureDocument)
    config.addImporter(schemaName, TextureJATSImporter)
  }
}
