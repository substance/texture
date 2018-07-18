import StorageClientConfig from "./StorageClientConfig"
import StorageClientTypes from "./StorageClientTypes"

/** 
 * @module dar/HttpStorageClientConfig
 * 
 * @description
 * This module holds all configuration parameters for an
 * HttpStorageClient instance
 */
export default class HttpStorageClientConfig extends StorageClientConfig {
  constructor() {
    super(StorageClientTypes.HTTP)
    this._storageUrl = null
  }

  getStorageUrl() {
    return this._storageUrl
  }

  setStorageUrl(storageUrl) {
    this._storageUrl = storageUrl
  }
}