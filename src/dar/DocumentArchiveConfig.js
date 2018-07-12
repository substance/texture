/** 
 * @module dar/DocumentArchiveConfig
 * 
 * @description
 * The base class for all document archive configuration classes. 
 * It should not be initialized directly.
 */
export default class DocumentArchiveConfig {
    constructor() {
        this._articleConfig = null
        this._context = null
        this._id = null
        this._storageClient = null
        this._storageConfig = null
    }

    getId() {
        return this._id
    }

    setId(id) {
        this._id = id
    }

    getArticleConfig() {
        return this._articleConfig
    }

    setArticleConfig(articleConfig) {
        this._articleConfig = articleConfig
    }

    getContext() {
        return this._context
    }

    setContext(context) {
        this._context = context
    }

    getStorageClient() {
        return this._storageClient
    }

    setStorageClient(storageClient) {
        this._storageClient = storageClient
    }

    getStorageConfig() {
        return this._storageConfig
    }

    setStorageConfig(storageConfig) {
        this._storageConfig = storageConfig
    }
}