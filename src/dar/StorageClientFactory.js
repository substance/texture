import HttpStorageClient from "./HttpStorageClient"
import StorageClientTypes from "./StorageClientTypes"
import VfsStorageClient from "./VfsStorageClient"

/** 
 * @module dar/StorageClientFactory
 * 
 * @description
 * A service class which offers various methods to create 
 * storage client instances
 */
export default class StorageClientFactory {

  /**
   * Creates a storage client instance based upon an incoming 
   * storage client configuration
   * 
   * @param {Object} storageConfig A storage client configuration
   * @return {Object} A storage client instance or null (default)
   */
  static getStorageClient(storageConfig) {
    let storageClient

    switch (storageConfig.getId()) {
      case StorageClientTypes.VFS:
        storageClient = new VfsStorageClient(window.vfs, storageConfig)
        break;
      case StorageClientTypes.HTTP:
        storageClient = new HttpStorageClient(storageConfig)
        break;
      default:
        storageClient = null
    }

    return storageClient
  }
}