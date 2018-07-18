/** 
 * @module dar/StorageClientConfig
 * 
 * @description
 * The base class for all storage client configuration classes. 
 * It should not be initialized directly.
 */
export default class StorageClientConfig {
  constructor(id) {
    this.id = id
  }

  getId() {
    return this.id
  }
}