import { 
    DocumentArchiveReadOnly,
    StorageClientFactory, 
    VfsStorageConfig 
} from "substance-texture"

window.addEventListener('load', function() {
    
    let vfsStorageConfig = new VfsStorageConfig()
    vfsStorageConfig.setDataFolder("./data")

    let storage = new StorageClientFactory.getStorageClient(storageConfig)
    let documentArchiveReadOnly = new DocumentArchiveReadOnly(storage)
    
    documentArchiveReadOnly.load("kitchen-sink")
        .then(function(documentArchive) {
            window.documentArchive = documentArchive
            console.log(documentArchive)
        })
        .catch(function(errors) {
            console.log(errors);
        });
})