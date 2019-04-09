import { Component, DefaultDOMElement, platform, Router, domHelpers } from 'substance'
import Texture from './Texture'

export default class TextureAppChrome extends Component {
  constructor (...args) {
    super(...args)

    this._router = new Router()
    // TODO: rethink how configuration is loaded
    this._config = Texture.getConfiguration()
  }

  didMount () {
    // if debug is turned on do not 'forward' to an error display and instead
    // leave the app in its failed state
    if (this.props.debug) {
      this._init()
    } else {
      this._init(err => {
        if (err) {
          console.error(err)
          this.setState({ error: err })
        }
      })
    }
    // Note: adding global handlers causes problems in the test suite
    if (!platform.test) {
      DefaultDOMElement.getBrowserWindow().on('keydown', this._keyDown, this)
      DefaultDOMElement.getBrowserWindow().on('drop', domHelpers.stopAndPrevent, this)
      DefaultDOMElement.getBrowserWindow().on('dragover', domHelpers.stopAndPrevent, this)
    }
    this._router.start()
    this.handleActions({
      'save': this._handleSave
    })
  }

  _handleSave () {
    this._save((err) => {
      if (err) console.error(err)
    })
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
  _init (cb) {
    if (!cb) cb = (err) => { if (err) throw err }
    this._setupChildContext((err, context) => {
      if (err) return cb(err)
      this._initContext(context, (err, context) => {
        if (err) return cb(err)
        this._loadArchive(this.props.archiveId, context, (err, archive) => {
          if (err) return cb(err)
          this._initArchive(archive, context, (err, archive) => {
            if (err) return cb(err)
            this._childContext = context
            this.setState({ archive })
            this._afterInit()
            this.emit('archive:ready')
          })
        })
      })
    })
  }

  _setupChildContext (cb) {
    cb(null, { router: this._router })
  }

  _initContext (context, cb) {
    cb(null, context)
  }

  _loadArchive () {
    throw new Error('_loadArchive not implemented')
  }

  _initArchive (archive, context, cb) {
    cb(null, archive)
  }

  _afterInit () {}

  _save (cb) {
    this.state.archive.save(err => {
      if (err) return cb(err)
      this._updateTitle(false)
      cb(null)
    })
  }

  _updateTitle () {}

  _keyDown (event) {
    // TODO: should this really be suppressed here?
    if (event.key === 'Dead') return
    if (this._handleKeydown) {
      this._handleKeydown(event)
    }
  }
}
