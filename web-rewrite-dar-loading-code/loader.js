import { DocumentArchiveReadOnly, InMemoryDarBuffer, VfsStorageClient } from "substance-texture"

window.addEventListener('load', function() {
  let storage = new VfsStorageClient(vfs, "./data")
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