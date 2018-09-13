import { DefaultDOMElement, parseKeyEvent } from 'substance'
import { InMemoryDarBuffer } from './dar'
import TextureAppChrome from './TextureAppChrome'

export default class TextureDesktopAppChrome extends TextureAppChrome {
  didMount () {
    super.didMount()
    this.props.ipc.on('document:save', () => {
      this._save()
    })
    this.props.ipc.on('document:save-as', (event, newArchiveDir) => {
      this._saveAs(newArchiveDir)
    })
    DefaultDOMElement.getBrowserWindow().on('click', this._click, this)
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

  _loadArchive (archiveId, context, cb) {
    const ArchiveClass = this._getArchiveClass()
    let storage = new this.props.FSStorageClient()
    let buffer = new InMemoryDarBuffer()
    let archive = new ArchiveClass(storage, buffer, context)
    // HACK: this should be done earlier in the lifecycle (after first didMount)
    // and later disposed properly. However we can accept this for now as
    // the app lives as a singleton atm.
    // NOTE: _archiveChanged is implemented by DesktopAppChrome
    archive.on('archive:changed', this._archiveChanged, this)
    archive.load(archiveId, cb)
  }

  _saveAs (newArchiveDir, cb) {
    console.info('saving as', newArchiveDir)
    this.state.archive.saveAs(newArchiveDir, err => {
      if (err) {
        console.error(err)
        return cb(err)
      }

      this._updateTitle(false)
      this.props.ipc.send('document:save-as:successful')
      // Update the browser url, so on reload, we get the contents from the
      // new location
      let newUrl = this.props.url.format({
        pathname: this.props.path.join(this.props.__dirname, 'index.html'),
        protocol: 'file:',
        query: {
          archiveDir: newArchiveDir
        },
        slashes: true
      })
      window.history.replaceState({}, 'After Save As', newUrl)
    })
  }

  _archiveChanged () {
    if (!this.state.archive) return
    const hasPendingChanges = this.state.archive.hasPendingChanges()
    if (hasPendingChanges) {
      this.props.ipc.send('document:unsaved')
      this._updateTitle(hasPendingChanges)
    }
  }

  _updateTitle (hasPendingChanges) {
    let newTitle = this.state.archive.getTitle()
    if (hasPendingChanges) {
      newTitle += ' *'
    }
    document.title = newTitle
  }

  _click (event) {
    const target = DefaultDOMElement.wrapNativeElement(event.target)
    if (target.is('a') && target.getAttribute('href') !== '#') {
      event.preventDefault()
      this.props.shell.openExternal(event.target.href)
    }
  }
}
