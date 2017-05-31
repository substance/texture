import { BasePackage } from 'substance'
import { TextureJATSPackage } from 'texture-jats'

export default {
  name: 'texture-base',
  configure(config) {
    config.import(BasePackage)
    config.import(TextureJATSPackage)
  }
}