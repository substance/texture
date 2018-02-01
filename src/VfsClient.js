import { ManifestLoader } from 'substance'

export default class VfsClient {
  constructor(vfs) {
    this.vfs = vfs
  }

  read(path) {
    let rawArchive = _readRawArchive(this.vfs, path)
    return Promise.resolve(rawArchive)
  }

  write() {
    console.error('writing not possible with virtual file system')
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
      type: type,
      data: content
    }
  })

  assets.forEach(asset => {
    let path = asset.attr('path')
    rawArchive[path] = {
      type: 'image/jpg',
      url: path
    }
  })
  return rawArchive
}
