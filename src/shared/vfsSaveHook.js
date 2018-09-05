import { platform } from 'substance'
import checkArchive from './checkArchive'

export default function vfsSaveHook (storage, ArchiveClass) {
  // monkey patch VfsStorageClient so that we can check if the stored data
  // can be loaded
  storage.write = (archiveId, rawArchive, cb) => {
    console.log('Writing archive:', rawArchive) // eslint-disable-line
    storage.read(archiveId, (err, originalRawArchive) => {
      if (err) return cb(err)
      rawArchive.resources = Object.assign({}, originalRawArchive.resources, rawArchive.resources)
      err = checkArchive(ArchiveClass, rawArchive)
      if (err) {
        if (platform.inBrowser) {
          console.error(err)
          window.alert('Exported archive is corrupt!') // eslint-disable-line no-alert
        }
        console.error(err.detail)
        return cb(err)
      } else {
        return cb(null, true)
      }
    })
  }
}
