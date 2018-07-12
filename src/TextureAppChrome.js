import { Component, DefaultDOMElement, platform } from 'substance'

import DocumentArchiveFactory from './dar/DocumentArchiveFactory'
import TextureArchive from './TextureArchive'

export default class TextureAppChrome extends Component {
  didMount () {
    // when the developer console is not open, display when there is an error
    
    if (!platform.devtools) {
      try 
      {
        this._init()
          .catch(function(error) {
            console.error(error)
            this.setState({error})
          })
      } 
      catch(error) {
        console.error(error)
        this.setState({error})
      }
    } 
    else {
      this._init()
    }

    DefaultDOMElement.getBrowserWindow().on('keydown', this._keyDown, this)
    DefaultDOMElement.getBrowserWindow().on('drop', this._supressDnD, this)
    DefaultDOMElement.getBrowserWindow().on('dragover', this._supressDnD, this)
  }

  dispose () {
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  getChildContext () {
    return this._childContext || {}
  }

  getInitialState () {
    return {
      archive: undefined,
      error: undefined
    }
  }

  /*
    4 initialisation stages:
    - _setupChildContext
    - _initContext
    - _loadArchive
    - _initArchive
  */
  _init () {
    let self = this

    // TODO: do we really need to separated the first two steps?
    
    new Promise(function(resolve, reject) {
      self._setupChildContext()
        .then(function(childContext) {
          self._childContext = childContext
          return self._initContext(childContext)
        })
        .then(function(initializedContext) {
          return self._loadArchive(self.props.archiveId, self._childContext)
        })
        .then(function(archive) {
          return self._initArchive(archive)
        })
        .then(function(archive) {
          self._afterInit()
          self.setState({archive})
          resolve(archive)
        })
        .catch(function(error) {
          self.setState({error})
          reject(error)
        })
    })
  }

  _setupChildContext () {
    return Promise.resolve({})
  }

  _initContext(context) {
    return Promise.resolve(context)
  }

  _loadArchive(archiveId, context) {
    let documentArchiveConfig = this.props.documentArchiveConfig
    documentArchiveConfig.setContext(context)
    
    let archive = DocumentArchiveFactory.getDocumentArchive(documentArchiveConfig)
    
    if (!archive)
    {
      archive = new TextureArchive(documentArchiveConfig)
    }

    return archive.load(archiveId)
  }

  _initArchive(archive) {
    return Promise.resolve(archive)
  }

  _afterInit () {}

  // TODO: need to rethink
  _save () {
    return this.state.archive.save().then(() => {
      this._updateTitle(false)
    }).catch(err => {
      console.error(err)
    })
  }

  _updateTitle () {}

  _keyDown (event) {
    if (event.key === 'Dead') return
    if (this._handleKeyDown) {
      this._handleKeyDown(event)
    }
  }

  _supressDnD (event) {
    event.preventDefault()
  }
}
