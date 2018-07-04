import { platform } from 'substance'
import checkArchive from './checkArchive'

export default function vfsSaveHook(storage, ArchiveClass, documentArchiveConfig) {
  // monkey patch VfsStorageClient so that we can check if the stored data
  // can be loaded
  storage.write = function(archiveId, rawArchive) {
    return new Promise(function (resolve, reject) {
      
      console.log('Writing archive:', rawArchive) // eslint-disable-line
      
      storage.read(archiveId)
        .then(function(originalRawArchive) {
          rawArchive.resources = Object.assign({}, originalRawArchive.resources, rawArchive.resources)
          return checkArchive(ArchiveClass, documentArchiveConfig, rawArchive)
        })
        .then(function() {
          resolve(true)
        })
        .catch(function(errors) {
          if (platform.inBrowser) {
            window.alert('Exported archive is corrupt!') //eslint-disable-line no-alert
          }
          console.error(errors)
          reject(errors)
        })
    })
  }
}
