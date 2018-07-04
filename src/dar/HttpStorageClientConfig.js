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
    constructor(storageUrl) {
        super(StorageClientTypes.HTTP)
        this.storageUrl = storageUrl
    }

    getStorageUrl() {
        return this.storageUrl
    }
}