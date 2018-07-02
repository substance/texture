import StorageConfig from "./StorageConfig"
import StorageTypes from "./StorageTypes"

export default class VfsStorageConfig extends StorageConfig {
    
    constructor() {
        super(StorageTypes.VFS)
        this.dataFolder = null
    }

    getDataFolder() {
        return this.dataFolder
    }

    setDataFolder(dataFolder) {
        this.dataFolder = dataFolder
    }
}