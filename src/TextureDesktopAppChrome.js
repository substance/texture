import { DefaultDOMElement } from 'substance'
import TextureAppChrome from './TextureAppChrome'

export default class DesktopAppChrome extends TextureAppChrome {

  didMount() {
    super.didMount()

    this.props.ipc.on('document:save', () => {
      this._save()
    })
    
    this.props.ipc.on('document:save-as', (event, newArchiveDir) => {
      this._saveAs(newArchiveDir)
    })

    DefaultDOMElement.getBrowserWindow().on('click', this._click, this)
  }

  _loadArchive(archiveId, context) {
    let self = this,
        archiveLoadingExecution = super._loadArchive(archiveId, context)

    return new Promise(function(resolve, reject) {
      archiveLoadingExecution
        .then(function(archive) {
          // HACK: this should be done earlier in the lifecycle (after first didMount)
          // and later disposed properly. However we can accept this for now as
          // the app lives as a singleton atm.
          // NOTE: _archiveChanged is implemented by DesktopAppChrome
          archive.on('archive:changed', self._archiveChanged, self)
          resolve(archive)
        })
        .catch(function(errors) {
          reject(errors)
        })
    })
  }

  _saveAs(newArchiveDir) {
    console.info('saving as', newArchiveDir)
    this.state.archive.saveAs(newArchiveDir).then(() => {
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
    }).catch(err => {
      console.error(err)
    })
  }

  _archiveChanged() {
    if (!this.state.archive) return
    const hasPendingChanges = this.state.archive.hasPendingChanges()
    if (hasPendingChanges) {
      this.props.ipc.send('document:unsaved')
      this._updateTitle(hasPendingChanges)
    }
  }

  _updateTitle(hasPendingChanges) {
    let newTitle = this.state.archive.getTitle()
    if (hasPendingChanges) {
      newTitle += " *"
    }
    document.title = newTitle
  }

  _click(event) {
    if (event.target.tagName === 'A' && event.target.attributes.href.value !== '#') {
      event.preventDefault()
      this.props.shell.openExternal(event.target.href)
    }
  }
}
