import {
    ReaderPackage,
    DocumentArchiveConfig,
    DocumentArchiveFactory,
    DocumentArchiveReadOnlyConfig,
    StorageClientFactory,
    VfsStorageConfig 
} from "substance-texture"

window.addEventListener('load', function() {
    
    let vfsStorageConfig = new VfsStorageConfig()
    vfsStorageConfig.setDataFolder("./data")

    let storageClient = StorageClientFactory.getStorageClient(vfsStorageConfig)

    let documentArchiveConfig = new DocumentArchiveReadOnlyConfig()
    documentArchiveConfig.setArticleConfig(ReaderPackage)
    documentArchiveConfig.setStorageClient(storageClient)
    
    let archiveReadOnly = DocumentArchiveFactory.getDocumentArchive(documentArchiveConfig)
    
    archiveReadOnly.load("elife-32671")
        .then(function(documentArchive) {
            console.log(documentArchive)
        })
        .catch(function(errors) {
            console.log(errors);
        })
})