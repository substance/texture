import {
  getQueryStringParam, Component, DefaultDOMElement, parseKeyEvent,
  HttpStorageClient, VfsStorageClient, InMemoryDarBuffer, substanceGlobals,
  platform
} from 'substance'
import {
  Texture, JATSImportDialog, TextureArchive
} from 'substance-texture'

window.addEventListener('load', () => {
  substanceGlobals.DEBUG_RENDERING = platform.devtools
  MyTextureEditor.mount({}, window.document.body)
})

/* Sample integration of Texture */
class MyTextureEditor extends Component {

  didMount() {
    this._init()
    DefaultDOMElement.getBrowserWindow().on('keydown', this._keyDown, this)
    DefaultDOMElement.getBrowserWindow().on('drop', this._supressDnD, this)
    DefaultDOMElement.getBrowserWindow().on('dragover', this._supressDnD, this)
  }

  dispose() {
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  getInitialState() {
    return {
      archive: undefined,
      error: undefined
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-app')
    let archive = this.state.archive
    let err = this.state.error

    if (archive) {
      el.append(
        $$(Texture, {archive})
      )
    } else if (err) {
      if (err.type === 'jats-import-error') {
        el.append(
          $$(JATSImportDialog, { errors: err.detail })
        )
      } else {
        el.append(
          'ERROR:',
          err.message
        )
      }
    } else {
      // LOADING...
    }
    return el
  }

  _init() {
    let archiveId = getQueryStringParam('archive') || 'kitchen-sink'
    let storageType = getQueryStringParam('storage') || 'vfs'
    let storageUrl = getQueryStringParam('storageUrl') || '/archives'
    let storage
    if (storageType==='vfs') {
      storage = new VfsStorageClient(window.vfs, './data/')
    } else {
      storage = new HttpStorageClient(storageUrl)
    }
    let buffer = new InMemoryDarBuffer()
    let archive = new TextureArchive(storage, buffer)

    let promise = archive.load(archiveId)
    .then(() => {
      setTimeout(() => {
        this.setState({archive})
      }, 0)
    })

    if (!platform.devtools) {
      promise.catch(error => {
        console.error(error)
        this.setState({error})
      })
    }

  }

  /*
    We may want an explicit save button, that can be configured on app level,
    but passed down to editor toolbars.
  */
  _save() {
    this.state.archive.save().then(() => {
      console.info('successfully saved')
    }).catch(err => {
      console.error(err)
    })
  }

  _keyDown(event) {
    if ( event.key === 'Dead' ) return
    // Handle custom keyboard shortcuts globally
    let archive = this.state.archive
    if (archive) {
      let manuscriptSession = archive.getEditorSession('manuscript')
      let handled = manuscriptSession.keyboardManager.onKeydown(event)
      if (!handled) {
        let key = parseKeyEvent(event)
        // CommandOrControl+S
        if (key === 'META+83' || key === 'CTRL+83') {
          this._save()
          event.preventDefault()
        }
      }
    }
  }

  /*
    Prevent app and browser from loading a dnd file
  */
  _supressDnD(event) {
    event.preventDefault()
  }
}
