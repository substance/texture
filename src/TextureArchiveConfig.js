import DocumentArchiveReadWriteConfig from "./dar/DocumentArchiveReadWriteConfig"

export default class TextureArchiveConfig extends DocumentArchiveReadWriteConfig {
  constructor() {
    super()
    this.setId("TEXTURE_ARCHIVE")
  }
}