import { platform } from 'substance'
import checkArchive from './checkArchive'

export default function vfsSaveHook (storage, ArchiveClass) {
  // monkey patch VfsStorageClient so that we can check if the stored data
  // can be loaded
  storage.write = (archiveId, rawArchive) => {
    console.log('Writing archive:', rawArchive) // eslint-disable-line
    return storage.read(archiveId)
      .then((originalRawArchive) => {
        rawArchive.resources = Object.assign({}, originalRawArchive.resources, rawArchive.resources)
        let err = checkArchive(ArchiveClass, rawArchive)
        if (err) {
          if (platform.inBrowser) {
            console.error(err)
            window.alert('Exported archive is corrupt!') // eslint-disable-line no-alert
          }
          console.error(err.detail)
          return Promise.reject(new Error('err'))
        } else {
          return Promise.resolve(true)
        }
      })
  }
}
