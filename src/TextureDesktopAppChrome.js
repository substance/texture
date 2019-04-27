import { DefaultDOMElement } from 'substance'
import { InMemoryDarBuffer } from './dar'
import TextureAppChrome from './TextureAppChrome'

export default class TextureDesktopAppChrome extends TextureAppChrome {
  didMount () {
    super.didMount()

    DefaultDOMElement.getBrowserWindow().on('click', this._click, this)
  }

  _getBuffer () {
    return new InMemoryDarBuffer()
  }

  _getStorage (storageType) {
    // Note: in the Desktop app, the storage is maintained by the main process
    // and passed as a prop directly. In contrast to the web-version
    // there is no control via HTTP param possible
    return this.props.storage
  }

  // emit an event on this component. The Electron binding in app.js listens to it and
  // handles it
  _handleSave () {
    this.emit('save')
  }

  _saveAs (newDarPath, cb) {
    console.info('saving as', newDarPath)
    let archive = this.state.archive
    archive.saveAs(newDarPath, err => {
      if (err) {
        console.error(err)
        return cb(err)
      }
      // HACK: this is kind of an optimization but formally it is not
      // 100% correct to continue with the same archive instance
      // Instead one would expect that cloning an archive returns
      // a new archive instance
      // Though, this would have other undesired implications
      // such as loosing the scroll position or undo history
      // Thus we move on with this solution, but we need to clear
      // the isReadOnly flag now.
      archive.isReadOnly = false
      this._updateTitle()
      cb()
    })
  }

  _updateTitle () {
    const archive = this.state.archive
    if (!archive) return
    let newTitle = archive.getTitle()
    if (archive.hasPendingChanges()) {
      newTitle += ' *'
    }
    document.title = newTitle
  }

  _click (event) {
    const target = DefaultDOMElement.wrapNativeElement(event.target)
    let url = target.getAttribute('href')
    if (target.is('a') && url !== '#') {
      event.preventDefault()
      this.emit('openExternal', url)
    }
  }
}
