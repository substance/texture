import {
  DefaultDOMElement,
} from 'substance'

import AppChrome from './AppChrome'

export default class DesktopAppChrome extends AppChrome {

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
      window.history.replaceState({}, 'After Save As', newUrl);
    }).catch(err => {
      console.error(err)
    })
  }

  _archiveChanged() {
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
