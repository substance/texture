import { ManifestLoader } from 'substance'

export default class VfsClient {
  constructor(vfs) {
    this.vfs = vfs
  }

  read(archiveId) {
    let rawArchive = _readRawArchive(this.vfs, archiveId)
    return Promise.resolve(rawArchive)
  }

  write(archiveId, data) { // eslint-disable-line
    console.error('Can not write on virtual file system')
    return Promise.resolve(false)
  }
}

function _readRawArchive(fs, darUrl) {
  let manifestXML = fs.readFileSync(`${darUrl}/manifest.xml`)
  let manifestSession = ManifestLoader.load(manifestXML)
  let manifest = manifestSession.getDocument()
  let docs = manifest.findAll('documents > document')
  let assets = manifest.findAll('assets > asset')
  let rawArchive = {
    'manifest.xml': {
      type: 'application/dar-manifest',
      data: manifestXML
    }
  }
  docs.forEach(entry => {
    let path = entry.attr('path')
    let type = entry.attr('type')
    let content = fs.readFileSync(`${darUrl}/${entry.path}`)
    rawArchive[path] = {
      encoding: 'utf8',
      type: type,
      data: content
    }
  })
  assets.forEach(asset => {
    let path = asset.attr('path')
    rawArchive[path] = {
      encoding: 'url',
      type: 'image/jpg',
      data: './data/kitchen-sink/'+path
    }
  })
  return rawArchive
}
