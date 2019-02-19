/* global vfs */
import { parseKeyEvent, platform, Router } from 'substance'
import TextureAppChrome from './TextureAppChrome'
import { VfsStorageClient, HttpStorageClient, InMemoryDarBuffer } from './dar'

export default class TextureWebAppChrome extends TextureAppChrome {
  constructor (...args) {
    super(...args)

    this._router = new Router()
  }

  _setupChildContext (cb) {
    super._setupChildContext((err, context) => {
      if (err) cb(err)
      else cb(null, Object.assign(context, { router: this._router }))
    })
  }

  didMount () {
    super.didMount()
    this._router.start()
  }

  _loadArchive (archiveId, context, cb) {
    let storage = this._getStorage(this.props.storageType)
    let buffer = new InMemoryDarBuffer()
    let ArchiveClass = this._getArchiveClass()
    let archive = new ArchiveClass(storage, buffer, context)
    // Don't catch exception in debug mode
    if (this.props.debug) {
      archive.load(archiveId, cb)
    } else {
      try {
        archive.load(archiveId, cb)
      } catch (err) {
        this.setState({
          error: err
        })
        console.error(err)
      }
    }
  }

  _getStorage (storageType) {
    if (storageType === 'vfs') {
      return new VfsStorageClient(vfs, this._getDefaultDataFolder())
    } else {
      return new HttpStorageClient(this.props.storageUrl)
    }
  }

  // TODO: try to share implementation with TextureDesktopAppChrome
  // move as much as possible into TextureAppChrome
  // and only add browser specific overrides here
  _handleKeydown (event) {
    let key = parseKeyEvent(event)
    // console.log('Texture received keydown for combo', key)
    let handled = false
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save(err => {
        if (err) console.error(err)
      })
      handled = true
    }
    if (!handled) {
      handled = this.refs.texture._handleKeydown(event)
    }
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  _getArchiveClass () { throw new Error('This method is abstract') }

  _getDefaultDataFolder () { throw new Error('This method  is abstract') }
}
