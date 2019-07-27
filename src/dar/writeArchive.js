import _require from './_require'

export default async function writeArchive (archiveDir, rawArchive, opts = {}) {
  const fs = opts.path || _require('fs')
  const path = opts.path || _require('path')

  let resourceNames = Object.keys(rawArchive.resources)
  let newVersion = '0'

  if (opts.versioning) {
    console.warn('Git based versioning is not yet implemented.')
  }

  return Promise.all(resourceNames.map(f => {
    let record = rawArchive.resources[f]
    let absPath = path.join(archiveDir, f)
    switch (record.encoding) {
      case 'utf8': {
        return _writeFile(fs, absPath, record.data, 'utf8')
      }
      case 'blob': {
        return _writeFile(fs, absPath, record.data)
      }
      // TODO: are there other encodings which we want to support?
      default:
        return false
    }
  })).then(() => {
    return newVersion
  })
}

function _writeFile (fs, p, data, encoding) {
  return new Promise((resolve, reject) => {
    if (typeof data.pipe === 'function') {
      let file = fs.createWriteStream(p)
      data.pipe(file)
      file.on('close', () => {
        resolve()
      })
    } else {
      fs.writeFile(p, data, encoding, (err) => {
        if (err) reject(err)
        else resolve()
      })
    }
  })
}
