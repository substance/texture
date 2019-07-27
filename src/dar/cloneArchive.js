import { platform } from 'substance'
import isDocumentArchive from './_isDocumentArchive'
import _require from './_require'

// FIXME: this file should only get bundled in commonjs version
let fsExtra
if (platform.inNodeJS || platform.inElectron) {
  fsExtra = _require('fs-extra')
}

export default async function cloneArchive (archiveDir, newArchiveDir, opts = {}) {
  // make sure that the given path is a dar
  if (await isDocumentArchive(archiveDir, opts)) {
    await fsExtra.copy(archiveDir, newArchiveDir)
    return true
  } else {
    throw new Error(archiveDir + ' is not a valid document archive.')
  }
}
