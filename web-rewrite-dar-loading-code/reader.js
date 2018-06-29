import { getQueryStringParam, substanceGlobals, platform } from 'substance'
import { DocumentArchiveReadOnly, InMemoryDarBuffer, VfsStorageClient } from "substance-texture"

window.addEventListener('load', function() {
  let storage = new VfsStorageClient(vfs, "./data")
  let buffer = new InMemoryDarBuffer()
  let documentArchiveReadOnly = new DocumentArchiveReadOnly(storage, buffer)

  documentArchiveReadOnly.load("kitchen-sink")
    .then(function(documentArchive) {
        window.documentArchive = documentArchive
        console.log(documentArchive)
    })
    .catch(function(errors) {
        console.log(errors);
    });
})
