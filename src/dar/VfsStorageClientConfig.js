import StorageClientConfig from "./StorageClientConfig"
import StorageClientTypes from "./StorageClientTypes"

/** 
 * @module dar/VfsStorageClientConfig
 * 
 * @description
 * This module holds all configuration parameters for an
 * VfsStorageClient instance
 */
export default class VfsStorageClientConfig extends StorageClientConfig {
    constructor() {
        super(StorageClientTypes.VFS)
        this.dataFolder = null
    }

    getDataFolder() {
        return this.dataFolder
    }

    setDataFolder(dataFolder) {
        this.dataFolder = dataFolder
    }
}