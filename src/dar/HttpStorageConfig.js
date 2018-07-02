import StorageConfig from "./StorageConfig"
import StorageTypes from "./StorageTypes"

export default class HttpStorageConfig extends StorageConfig {
    
    constructor(storageUrl) {
        super(StorageTypes.HTTP)
        this.storageUrl = storageUrl
    }

    getStorageUrl() {
        return this.storageUrl
    }
}