/* global FileReader, Buffer */
const darServer = require('dar-server')
const path = require('path')

/*
  A storage client optimised for Desktop clients

  NOTE: No versioning is done atm, but users can do a git init in their Dar
  folders.
*/
export default class FSStorageClient {
  read (archiveDir, cb) {
    darServer.readArchive(archiveDir, { noBinaryContent: true, ignoreDotFiles: true })
      .then(rawArchive => {
        // Turn binaries into urls
        Object.keys(rawArchive.resources).forEach(recordPath => {
          let record = rawArchive.resources[recordPath]
          if (record._binary) {
            delete record._binary
            record.encoding = 'url'
            record.data = path.join(archiveDir, record.path)
          }
        })
        cb(null, rawArchive)
      })
      .catch(cb)
  }

  write (archiveDir, rawArchive, cb) {
    _convertBlobs(rawArchive)
      .then(() => {
        return darServer.writeArchive(archiveDir, rawArchive)
      })
      .then((version) => {
        cb(null, JSON.stringify({ version }))
      })
      .catch(cb)
  }

  clone (archiveDir, newArchiveDir, cb) {
    darServer.cloneArchive(archiveDir, newArchiveDir)
      .then((success) => {
        if (success) cb()
        else cb(new Error('Could not clone archive'))
      })
      .catch(cb)
  }
}

/*
  Convert all blobs to array buffers
*/
async function _convertBlobs (rawArchive) {
  let resources = rawArchive.resources
  let paths = Object.keys(resources)
  for (var i = 0; i < paths.length; i++) {
    let record = resources[paths[i]]
    if (record.encoding === 'blob') {
      record.data = await _blobToArrayBuffer(record.data)
    }
  }
}

function _blobToArrayBuffer (blob) {
  return new Promise(resolve => {
    let reader = new FileReader()
    reader.onload = function () {
      if (reader.readyState === 2) {
        var buffer = Buffer.from(reader.result)
        resolve(buffer)
      }
    }
    reader.readAsArrayBuffer(blob)
  })
}
