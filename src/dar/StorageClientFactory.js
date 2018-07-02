import HttpStorageClient from "./HttpStorageClient"
import StorageTypes from "./StorageTypes"
import VfsStorageClient from "./VfsStorageClient"

export default class StorageClientFactory {
    static getStorageClient(storageConfig) {
        let storageClient

        switch( storageConfig.getId() ) {
            case StorageTypes.VFS:
                storageClient = new VfsStorageClient(vfs, storageConfig)
                break;
            case StorageTypes.HTTP:
                storageClient = new HttpStorageClient(storageConfig)
                break;
            default:
        }

        return storageClient
    }
}