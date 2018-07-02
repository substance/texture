export default class DocumentArchiveConfig {
    constructor(id) {
        this.id = id

        this.articleConfig = null
        this.context = null
        this.storageClient = null
    }

    getId() {
        return this.id
    }

    getArticleConfig() {
        return this.articleConfig
    }

    setArticleConfig(articleConfig) {
        this.articleConfig = articleConfig
    }

    getContext() {
        return this.context
    }

    setContext(context) {
        this.context = context
    }

    getStorageClient() {
        return this.storageClient
    }

    setStorageClient(storageClient) {
        this.storageClient = storageClient
    }
}