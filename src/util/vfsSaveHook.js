export default function vfsSaveHook(storage, ArchiveClass) {
  // monkey patch VfsStorageClient so that we can check if the stored data
  // can be loaded
  storage.write = (archiveId, rawArchive) => {
    console.log('Writing archive:', rawArchive) // eslint-disable-line
    return storage.read(archiveId)
    .then((originalRawArchive) => {
      rawArchive.resources = Object.assign({}, originalRawArchive.resources, rawArchive.resources)
      let testArchive = new ArchiveClass()
      try {
        testArchive._ingest(rawArchive)
        return Promise.resolve(true)
      } catch (error) {
        window.alert('Exported archive is corrupt!') //eslint-disable-line no-alert
        console.error(error.detail)
        return Promise.reject()
      }
    })
  }
}
