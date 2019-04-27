import { Component, DefaultDOMElement, platform, Router, domHelpers } from 'substance'
import { throwMethodIsAbstract } from './kit'
import Texture from './Texture'

export default class TextureAppChrome extends Component {
  constructor (...args) {
    super(...args)

    this._router = new Router()
    // TODO: rethink how configuration is loaded
    this._config = Texture.getConfiguration()
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

  didMount () {
    this._init(err => {
      // if debug is turned on do not 'forward' to an error display and instead
      // leave the app in its failed state
      if (err) {
        console.error(err)
        // TODO: we need to make sure that we disable 'debug' when bundling the release version
        if (!this.props.debug) {
          this.setState({ error: err })
        }
      }
    })
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

  dispose () {
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  _getBuffer () {
    throwMethodIsAbstract()
  }

  _getStorage () {
    throwMethodIsAbstract()
  }

  _loadArchive (archiveId, context, cb) {
    const ArchiveClass = this._getArchiveClass()
    let storage = this._getStorage()
    let buffer = this._getBuffer()
    let archive = new ArchiveClass(storage, buffer, context, this._config)
    // HACK: this should be done earlier in the lifecycle (after first didMount)
    // and later disposed properly. However we can accept this for now as
    // the app lives as a singleton atm.
    archive.on('archive:changed', this._archiveChanged, this)
    // Don't catch exception in debug mode
    const _afterLoad = (err, archive) => {
      if (err) return cb(err)
      if (this.props.isReadOnly) {
        archive.isReadOnly = true
      }
      cb(null, archive)
    }
    if (this.props.debug) {
      archive.load(archiveId, _afterLoad)
    } else {
      try {
        archive.load(archiveId, _afterLoad)
      } catch (err) {
        this.setState({
          error: err
        })
        console.error(err)
      }
    }
  }

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

  _initArchive (archive, context, cb) {
    cb(null, archive)
  }

  _afterInit () {
    // Update window title after archive loading to display title
    this._updateTitle()
  }

  _archiveChanged () {
    this._updateTitle()
  }

  _handleSave () {
    this._save((err) => {
      if (err) console.error(err)
    })
  }

  _save (cb) {
    this.state.archive.save(err => {
      if (err) return cb(err)
      this._updateTitle()
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

  _handleKeydown (event) {
    let handled = false
    handled = this.refs.texture._handleKeydown(event)
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
