import { Component, DefaultDOMElement, platform } from 'substance'

export default class TextureAppChrome extends Component {
  didMount () {
    // when the developer console is not open, display when there is an error
    if (!platform.devtools) {
      try {
        this._init().catch(error => {
          console.error(error)
          this.setState({error})
        })
      } catch (error) {
        console.error(error)
        this.setState({error})
      }
    } else {
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
            this._afterInit()
            this._setState({ archive })
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

  _initArchive (archive) {
    return archive
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
