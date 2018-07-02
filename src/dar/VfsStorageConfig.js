import StorageConfig from "./StorageConfig"
import StorageTypes from "./StorageTypes"

export default class VfsStorageConfig extends StorageConfig {
    
    constructor(dataFolder) {
        super(StorageTypes.VFS)
        this.dataFolder = dataFolder || './data'
    }

    getDataFolder() {
        return this.dataFolder
    }
}