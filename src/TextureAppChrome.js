import { Component, DefaultDOMElement, platform } from 'substance'

export default class TextureAppChrome extends Component {
  didMount () {
    // when the developer console is not open, display when there is an error
    if (!platform.devtools) {
      this._init(err => {
        if (err) {
          console.error(err)
          this.setState({ error: err })
        }
      })
    } else {
      this._init()
    }
    // Note: adding global handlers causes problems in the test suite
    if (!platform.test) {
      DefaultDOMElement.getBrowserWindow().on('keydown', this._keyDown, this)
      DefaultDOMElement.getBrowserWindow().on('drop', this._supressDnD, this)
      DefaultDOMElement.getBrowserWindow().on('dragover', this._supressDnD, this)
    }
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
    cb(null, {})
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

  _supressDnD (event) {
    event.preventDefault()
  }
}
