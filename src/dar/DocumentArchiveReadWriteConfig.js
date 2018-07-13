import DocumentArchiveTypes from "./DocumentArchiveTypes"
import DocumentArchiveConfig from "./DocumentArchiveConfig";

/** 
 * @module dar/DocumentArchiveReadWriteConfig
 * 
 * @description
 * This module holds all configuration parameters for a
 * read-write document archive (read-write DAR) instance
 */
export default class DocumentArchiveReadWriteConfig extends DocumentArchiveConfig {
  constructor() {
    super()
    this.setId(DocumentArchiveTypes.READ_WRITE)
    this.buffer = null
  }

  getBuffer() {
    return this.buffer
  }

  setBuffer(buffer) {
    this.buffer = buffer
  }
}